import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Patch,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SearchForUserDto } from './dtos/search-user.dto';
import { User } from './../../common/decorators/user.decorator';
import { UpdateUserProfileDto } from './dtos/update-user.dto';

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

  @Patch('/update_profile')
  @UseInterceptors(UploadedFile)
  async updateUserData(
    @UploadedFile('avatar') file: Express.Multer.File,
    @Body() body: UpdateUserProfileDto,
    @User('_id', ParseUUIDPipe) userId: string,
  ) {
    return this.userService.updateUserProflie(file, body, userId);
  }
}
