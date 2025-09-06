import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { VerifyAccountDto } from '../user/dtos/verify-account.dto';
import { GenerateOtpDto } from '../user/dtos/generate-otp.dto';
import { LoginDto } from './dtos/login.dto';
import { Public } from './../../common/decorators/public.decorator';
import { ForgotPasswordDto, ResetPasswordDto } from './dtos/resetPassword.dto';

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
  //forgot password
  @Post('/forgot_password')
  forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body);
  }

  //reset password
  @Post('/reset_password')
  resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body);
  }
}
