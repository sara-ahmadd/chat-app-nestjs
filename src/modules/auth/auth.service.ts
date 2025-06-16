import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly _UserService: UserService) {}
  async register(body: CreateUserDto) {
    try {
      //add to DB
      const user = await this._UserService.createUser(body);
      return { success: true, user };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
