import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { JwtModule } from '@nestjs/jwt'
import { Conversation } from './entities/conversation.entity'
import { ConversationParticipant } from './entities/conversation-participant.entity'
import { Message } from './entities/message.entity'
import { User } from '../users/entities/user.entity'
import { ChatController } from './chat.controller'
import { ChatService } from './chat.service'

@Module({
  imports: [TypeOrmModule.forFeature([Conversation, ConversationParticipant, Message, User]), JwtModule.register({})],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
