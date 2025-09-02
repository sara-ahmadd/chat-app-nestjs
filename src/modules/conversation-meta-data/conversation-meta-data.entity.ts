import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';

@Entity()
export class ConversationMetaData {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.conversationMetaData)
  user: User;

  @ManyToOne(
    () => Conversation,
    (conversation) => conversation.conversationMetaData,
  )
  conversation: Conversation;

  @ManyToOne(() => Message, { nullable: true })
  lastReadMessage: Message;

  @CreateDateColumn({ type: Date })
  createdAt: string;

  @UpdateDateColumn({ type: Date })
  updatedAt: string;
}
