import {
  BadRequestException,
  ConflictException,
  Injectable,
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
}
