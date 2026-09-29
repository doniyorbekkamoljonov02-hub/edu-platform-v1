import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm'

import { ConversationParticipant } from './conversation-participant.entity'
import { Message } from './message.entity'

@Entity('conversations')
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn()
  createdAt: Date

  @OneToMany(() => ConversationParticipant, 'conversation')
  participants: ConversationParticipant[]

  @OneToMany(() => Message, 'conversation')
  messages: Message[]
}
