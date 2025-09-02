import { ConversationMetaData } from '../conversation-meta-data/conversation-meta-data.entity';
import { Message } from '../message/message.entity';
import { Gender } from './../../common/types/genderEnum';
import { Roles } from './../../common/types/userRolesEnum';
import { hashText } from './../../utils/hashing/hashText';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export const defaultFemaleAvatar =
  'https://res.cloudinary.com/dpiuyacez/image/upload/v1748543544/Screenshot_2025-05-29_213023_h47qdn.png';

export const defaultMaleAvatar =
  'https://res.cloudinary.com/dpiuyacez/image/upload/v1748543585/Screenshot_2025-05-29_213046_kyae5x.png';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  _id: string;

  @Column()
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Gender,
    default: Gender.MALE,
  })
  gender: Gender;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: string;

  @CreateDateColumn({ type: Date })
  createdAt: string;

  @UpdateDateColumn({ type: Date })
  updatedAt: string;

  @BeforeInsert()
  setDefaultAvatar() {
    if (!this.avatar) {
      this.avatar =
        this.gender === 'male' ? defaultMaleAvatar : defaultFemaleAvatar;
    }
  }
  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await hashText(this.password);
    }
  }

  @Column({ default: defaultFemaleAvatar })
  avatar: string;

  @Column({ nullable: true })
  avatarPublicId: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isTyping: boolean;

  @OneToMany(
    () => ConversationMetaData,
    (conversationMetaData) => conversationMetaData.user,
  )
  conversationMetaData: ConversationMetaData;

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  lastSeenAt: Date;

  @ManyToMany(() => User, (user) => user.friends)
  @JoinTable({
    name: 'user_friends',
    joinColumn: {
      name: 'userId',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'friendId',
      referencedColumnName: 'id',
    },
  })
  friends: User[];

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  changeCredentials: Date;
}
