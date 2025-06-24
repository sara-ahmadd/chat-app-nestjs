import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { VerifyAccountDto } from '../user/dtos/verify-account.dto';
import { GenerateOtpDto } from '../user/dtos/generate-otp.dto';
import { LoginDto } from './dtos/login.dto';
import { Public } from 'src/common/decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('/verify_otp')
  verifyOtp(@Body() body: VerifyAccountDto) {
    return this.authService.verifyOtp(body);
  }

  @Post('/generate_otp')
  generateOtp(@Body() body: GenerateOtpDto) {
    return this.authService.sendOtp(body.email);
  }
  @Post('/login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
