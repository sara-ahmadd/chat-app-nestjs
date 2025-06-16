import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import { v4 as uuidv4 } from 'uuid';

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
      throw new ConflictException('Email already exists');
    }
  }
  async getUserByEmail(email: string) {
    try {
      const user = await this._UserRepository.getUserByEmail(email);
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async validateUser(id: number, isActive: boolean) {
    try {
      const updatedUser = await this._UserRepository.updateUser(id, {
        isActive,
      });
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
