import {
  BadRequestException,
  ConflictException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(private readonly _UserRepository: UserRepository) {}

  async createUser(body: CreateUserDto) {
    try {
      const newId = uuidv4();
      const user = await this._UserRepository.create({
        data: { ...body, _id: newId },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchForUserByEmail(email: string) {
    try {
      const user = await this._UserRepository.getUserByEmail(email, {
        _id: true,
        email: true,
        userName: true,
        avatar: true,
        isOnline: true,
        lastSeenAt: true,
      });
      return { message: 'user is fetched', user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllUserDataByEmail(email: string) {
    try {
      const user = await this._UserRepository.getUserByEmail(email);
      return { message: 'user is fetched', user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getUserById(_id: string) {
    try {
      const user = await this._UserRepository.getUserBy_Id(_id, {
        friends: true,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getUserProfile(_id: string) {
    try {
      const user = await this._UserRepository.getUserBy_Id(_id);
      return {
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          avatar: user.avatar,
          isOline: user.isOnline,
          lastSeenAt: user.lastSeenAt,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllUsers() {
    const users = await this._UserRepository.getAllUsers();
    return { message: 'All users fetched successfully', users };
  }

  async getFriendsOfCurrentUser(userId: string) {
    const user = await this._UserRepository.getUserBy_Id(userId, {
      friends: true,
    });

    return { friends: user.friends };
  }
  async saveUser(user: User) {
    return this._UserRepository.save(user);
  }
  async validateUser(userId: string, isActive: boolean) {
    try {
      const updatedUser = await this._UserRepository.updateUser(userId, {
        isActive,
      });
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
