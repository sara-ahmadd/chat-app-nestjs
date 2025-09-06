import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';
import { generate } from 'otp-generator';
import { JWTFunctions } from './../../common/services/jwt-service.service';
import { MailerEmailService } from './../../common/services/mailer.service';
import { compareHash, hashText } from './../../utils/hashing/hashText';
import { verifyAccount } from './../../utils/html-templates/verifyAccount';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserService } from '../user/user.service';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto, ResetPasswordDto } from './dtos/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly _UserService: UserService,
    private readonly MailerEmailService: MailerEmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
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
    await this.cacheManager.set(`${email}-otp`, otp, 600000); //600000 ms
    console.log({ otp });
    await this.MailerEmailService.sendEmail({
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
    const { user } = await this._UserService.searchForUserByEmail(email);
    await this._UserService.validateUser(user._id, true);
    await this.cacheManager.del(`${email}-otp`);
    return { message: 'Account is verified successfully' };
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

  async forgotPassword(body: ForgotPasswordDto) {
    const user = await this._UserService.getUserByEmail(body.email);
    if (!user) throw new BadRequestException('user is not found');
    if (!user.isActive) throw new BadRequestException('user is not verified');

    return await this.sendOtp(body.email);
  }

  async resetPassword(body: ResetPasswordDto) {
    const user = await this._UserService.getUserByEmail(body.email);
    if (!user) throw new BadRequestException('user is not found');
    if (!user.isActive) throw new BadRequestException('user is not verified');

    // set otp in cache manager, that expires after 5 minutes
    const getOtp = await this.cacheManager.get(`${user.email}-otp`);
    if (!getOtp || getOtp !== body.otp) {
      console.log({ otp: body.otp, getOtp });
      throw new BadRequestException('invalid otp');
    }

    user.password = await hashText(body.password);
    user.changeCredentials = new Date();

    await this._UserService.saveUser(user);

    return {
      status: 'success',
      message: 'password is updated successfully',
    };
  }
}
