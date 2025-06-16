import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { generate } from 'otp-generator';
import { MailerService } from '@nestjs-modules/mailer';
import { verifyAccount } from 'src/utils/html-templates/verifyAccount';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { VerifyAccountDto } from '../user/dtos/verify-account.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly Mailer_Service: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async register(body: CreateUserDto) {
    try {
      //add to DB
      const user = await this._UserService.createUser(body);
      await this.sendOtp(body.email);
      return { message: 'User registered successfully', user };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
  async sendOtp(email: string) {
    const otp = generate(10);
    // set otp in cache manager, that expires after 5 minutes
    await this.cacheManager.set(`${email}-otp`, otp);

    await this.sendEmail({
      email: email,
      subject: 'Verify your account',
      html: verifyAccount(otp),
    });
    return {
      message: 'otp is sent to your email',
    };
  }
  async verifyOtp({ otp, email }: { otp: string; email: string }) {
    const getOtp = await this.cacheManager.get(`${email}-otp`);
    if (!getOtp || getOtp !== otp) {
      throw new BadRequestException({ error: 'otp is invalid.', getOtp });
    }
    const user = await this._UserService.getUserByEmail(email);
    await this._UserService.validateUser(user.id, true);
    await this.cacheManager.del(`${email}-otp`);
    return { message: 'Account is verified successfully' };
  }

  async sendEmail({
    email,
    subject,
    html,
  }: {
    email: string;
    subject: string;
    html: string;
  }) {
    this.Mailer_Service.sendMail({
      from: 'Chat App 📧',
      to: email,
      subject,
      html,
    });
  }
}
