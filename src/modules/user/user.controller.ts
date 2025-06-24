import { Controller, Get, Query, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { SearchForUserDto } from './dtos/search-user.dto';
import { User } from './../../common/decorators/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get('/find_user')
  async searchForUser(@Query() query: SearchForUserDto) {
    return this.userService.searchForUserByEmail(query.email);
  }

  @Get('/me')
  async getUserProfile(@User('_id') userId: string) {
    return this.userService.getUserProfile(userId);
  }
}
