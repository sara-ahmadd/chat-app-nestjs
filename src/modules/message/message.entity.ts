import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Conversation } from '../conversation/conversation.entity';
import { User } from '../user/user.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  _id: string;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    onDelete: 'CASCADE',
  })
  conversation: Conversation;

  @ManyToOne(() => User)
  sentBy: User;

  @Column()
  contentText: string;

  @Column({ nullable: true })
  contentImgUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
