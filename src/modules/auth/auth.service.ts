import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { generate } from 'otp-generator';
import { MailerService } from '@nestjs-modules/mailer';
import { verifyAccount } from 'src/utils/html-templates/verifyAccount';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { VerifyAccountDto } from '../user/dtos/verify-account.dto';
import { LoginDto } from './dtos/login.dto';
import { compareHash } from 'src/utils/hashing/hashText';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JWTFunctions } from 'src/common/services/jwt-service.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly Mailer_Service: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    // private readonly JWTService: JwtService,
    private readonly configService: ConfigService,
    private readonly _JWTFunctions: JWTFunctions,
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
    await this.cacheManager.set(`${email}-otp`, otp, 300000); //300000 ms

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
    // set otp in cache manager, that expires after 5 minutes
    const getOtp = await this.cacheManager.get(`${email}-otp`);
    if (!getOtp || getOtp !== otp) {
      console.log({ otp, getOtp });
      throw new BadRequestException('invalid otp');
    }
    // console.log({ otp, getOtp });
    const { user } = await this._UserService.searchForUserByEmail(email);
    await this._UserService.validateUser(user._id, true);
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

  async login(body: LoginDto) {
    const { email, password } = body;

    //check user email & password
    const { user } = await this._UserService.getAllUserDataByEmail(email);
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    if (!user.isActive) {
      throw new BadRequestException('verify your account first');
    }
    const checkPassword = compareHash(password, user.password);
    if (!checkPassword) {
      throw new BadRequestException('Invalid credentials');
    }
    const token = this._JWTFunctions.generateAccessToken({
      _id: user._id,
      email: user.email,
    });
    const refreshToken = this._JWTFunctions.generateRefreshToken({
      _id: user._id,
      email: user.email,
    });
    return { message: 'user logged in successfully', token, refreshToken };
  }
}
