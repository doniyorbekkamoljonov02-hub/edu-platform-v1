import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'

import { Conversation } from './conversation.entity'
import { User } from '../../users/entities/user.entity'

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('uuid')
  conversationId: string

  @Column('uuid')
  senderId: string

  @Column({ type: 'text', nullable: true })
  text: string | null

  @Column({ type: 'varchar', nullable: true })
  attachmentUrl: string | null

  @Column({ type: 'varchar', nullable: true })
  attachmentType: string | null

  @Column({ type: 'boolean', default: false })
  isRead: boolean

  @CreateDateColumn()
  createdAt: Date

  @ManyToOne(() => Conversation, 'messages', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'conversationId' })
  conversation: Conversation

  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'senderId' })
  sender: User
}
