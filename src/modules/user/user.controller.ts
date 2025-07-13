import {
  Body,
  Controller,
  Get,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { SearchForUserDto } from './dtos/search-user.dto';
import { User } from './../../common/decorators/user.decorator';
import { UpdateUserProfileDto } from './dtos/update-user.dto';
import { FileInterceptor } from '@nestjs/platform-express';

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
  @UseInterceptors(FileInterceptor('avatar'))
  async updateUserData(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserProfileDto,
    @User('_id', ParseUUIDPipe) userId: string,
  ) {
    return this.userService.updateUserProflie(file, body, userId);
  }

  @Post('/verify_email_update')
  async verifyEmailUpdate(
    @Body() body: { oldEmail: string; newEmail: string; otp: string },
  ) {
    return this.userService.confirmEmailUpdate(body);
  }
}
