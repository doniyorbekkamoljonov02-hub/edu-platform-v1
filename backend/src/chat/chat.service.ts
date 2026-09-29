import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { Subject } from 'rxjs'
import { Conversation } from './entities/conversation.entity'
import { ConversationParticipant } from './entities/conversation-participant.entity'
import { Message } from './entities/message.entity'
import { User } from '../users/entities/user.entity'

@Injectable()
export class ChatService {
  private readonly streams = new Map<string, Subject<MessageEvent>>()

  constructor(
    @InjectRepository(Conversation) private readonly conversations: Repository<Conversation>,
    @InjectRepository(ConversationParticipant) private readonly participants: Repository<ConversationParticipant>,
    @InjectRepository(Message) private readonly messages: Repository<Message>,
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  streamFor(userId: string) {
    if (!this.streams.has(userId)) this.streams.set(userId, new Subject<MessageEvent>())
    return this.streams.get(userId)!.asObservable()
  }

  async contacts(currentUserId: string) {
    const users = await this.users.find({ where: { isActive: true } })
    return users
      .filter((u) => u.id !== currentUserId)
      .map((u) => ({ id: u.id, firstName: u.firstName, lastName: u.lastName, role: u.role, avatarUrl: u.avatarUrl }))
  }

  async listConversations(userId: string) {
    const mine = await this.participants.find({ where: { userId } })
    if (!mine.length) return []
    const ids = mine.map((p) => p.conversationId)
    const allParticipants = await this.participants.find({ where: { conversationId: In(ids) }, relations: { user: true } })
    const result = await Promise.all(ids.map(async (id) => {
      const people = allParticipants.filter((p) => p.conversationId === id && p.userId !== userId)
      const last = await this.messages.findOne({ where: { conversationId: id }, order: { createdAt: 'DESC' } })
      const unreadMine = await this.messages.find({ where: { conversationId: id, isRead: false } })
      return {
        id,
        people: people.map((p) => ({ id: p.user.id, firstName: p.user.firstName, lastName: p.user.lastName, role: p.user.role, avatarUrl: p.user.avatarUrl })),
        lastMessage: last ?? null,
        unreadCount: unreadMine.filter((message) => message.senderId !== userId).length,
      }
    }))
    return result.sort((a, b) => String(b.lastMessage?.createdAt ?? '').localeCompare(String(a.lastMessage?.createdAt ?? '')))
  }

  async createConversation(userId: string, otherUserId: string) {
    if (userId === otherUserId) throw new ForbiddenException('O‘zingiz bilan chat ochib bo‘lmaydi.')
    const other = await this.users.findOneBy({ id: otherUserId })
    if (!other) throw new NotFoundException('Foydalanuvchi topilmadi.')

    const mine = await this.participants.find({ where: { userId } })
    for (const p of mine) {
      const pair = await this.participants.find({ where: { conversationId: p.conversationId } })
      if (pair.length === 2 && pair.some((x) => x.userId === otherUserId)) return { id: p.conversationId }
    }

    const conversation = await this.conversations.save(this.conversations.create())
    await this.participants.save([
      this.participants.create({ conversationId: conversation.id, userId }),
      this.participants.create({ conversationId: conversation.id, userId: otherUserId }),
    ])
    return conversation
  }

  async getMessages(conversationId: string, userId: string) {
    await this.assertParticipant(conversationId, userId)

    // Opening a conversation counts as reading every message sent by the other person.
    const unread = await this.messages.find({
      where: { conversationId, isRead: false },
    })
    const toMark = unread.filter((message) => message.senderId !== userId)
    if (toMark.length) {
      toMark.forEach((message) => { message.isRead = true })
      await this.messages.save(toMark)
      const people = await this.participants.find({ where: { conversationId } })
      people.forEach((p) => this.streams.get(p.userId)?.next({
        data: { type: 'read', conversationId, readerId: userId },
      } as MessageEvent))
    }

    return this.messages.find({
      where: { conversationId },
      relations: { sender: true },
      order: { createdAt: 'ASC' },
    })
  }

  async send(conversationId: string, userId: string, text?: string, attachmentUrl?: string, attachmentType?: string) {
    await this.assertParticipant(conversationId, userId)
    if (!text?.trim() && !attachmentUrl) throw new ForbiddenException('Bo‘sh xabar yuborib bo‘lmaydi.')
    const message = await this.messages.save(this.messages.create({
      conversationId, senderId: userId, text: text?.trim() || null, attachmentUrl: attachmentUrl || null, attachmentType: attachmentType || null,
    }))
    const sender = await this.users.findOneBy({ id: userId })
    const full = { ...message, sender: sender ? { id: sender.id, firstName: sender.firstName, lastName: sender.lastName, role: sender.role, avatarUrl: sender.avatarUrl } : null }
    const people = await this.participants.find({ where: { conversationId } })
    people.forEach((p) => this.streams.get(p.userId)?.next({ data: { type: 'message', message: full } } as MessageEvent))
    return full
  }

  async removeMessage(messageId: string, userId: string) {
    const message = await this.messages.findOneBy({ id: messageId })
    if (!message) throw new NotFoundException('Xabar topilmadi.')
    if (message.senderId !== userId) throw new ForbiddenException('Faqat o‘zingiz yuborgan xabarni o‘chira olasiz.')
    const conversationId = message.conversationId
    await this.messages.remove(message)
    const people = await this.participants.find({ where: { conversationId } })
    people.forEach((p) => this.streams.get(p.userId)?.next({ data: { type: 'deleted', messageId, conversationId } } as MessageEvent))
    return { success: true }
  }

  private async assertParticipant(conversationId: string, userId: string) {
    const participant = await this.participants.findOneBy({ conversationId, userId })
    if (!participant) throw new ForbiddenException('Bu suhbatga kirish huquqingiz yo‘q.')
  }
}
