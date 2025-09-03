import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';
import { ConversationMetaData } from '../conversation-meta-data/conversation-meta-data.entity';

@Entity()
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Message, (message) => message.conversation, {
    cascade: true,
    eager: true,
  })
  messages: Message[];

  @ManyToMany(() => User)
  @JoinTable()
  participants: User[];

  @Column({ default: false })
  isGroup: boolean;

  @OneToMany(
    () => ConversationMetaData,
    (convMetaData) => convMetaData.conversation,
  )
  conversationMetaData: ConversationMetaData[];

  @Column({ nullable: true })
  title: string;

  @BeforeInsert()
  @BeforeUpdate()
  validateTitleBasedOnIsGroup() {
    if (this.isGroup && !this.title) {
      throw new Error('title is required in group conversation.');
    }
  }

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
