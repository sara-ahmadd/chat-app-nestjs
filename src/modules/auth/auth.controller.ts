import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('/verify_otp')
  verifyOtp(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }
}
