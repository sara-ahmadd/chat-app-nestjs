import { Gender } from 'src/common/types/genderEnum';
import { Roles } from 'src/common/types/userRolesEnum';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';

export const defaultFemaleAvatar =
  'https://res.cloudinary.com/dpiuyacez/image/upload/v1748543544/Screenshot_2025-05-29_213023_h47qdn.png';

export const defaultMaleAvatar =
  'https://res.cloudinary.com/dpiuyacez/image/upload/v1748543585/Screenshot_2025-05-29_213046_kyae5x.png';

@Unique(['email'])
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  _id: string;

  @Column()
  userName: string;

  @Column()
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

  @Column({ default: defaultFemaleAvatar })
  avatar: string;

  @Column({ default: false })
  isOnline: boolean;

  @Column({ type: Date, default: () => 'CURRENT_TIMESTAMP' })
  lastSeenAt: Date;
}
