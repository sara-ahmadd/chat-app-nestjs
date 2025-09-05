import {
  BadRequestException,
  ConflictException,
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './user.repository';
import { v4 as uuidv4 } from 'uuid';
import { User } from './user.entity';
import { UpdateUserProfileDto } from './dtos/update-user.dto';
import { FilesService } from './../../common/services/files.service';
import { ConfigService } from '@nestjs/config';
import { MailerEmailService } from './../../common/services/mailer.service';
import { verifyEmailUpdate } from './../../utils/html-templates/verifyEmailUpdate';
import { generate } from 'otp-generator';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    private readonly _UserRepository: UserRepository,
    private readonly filesService: FilesService,
    private readonly _ConfigService: ConfigService,
    private readonly MailerEmailService: MailerEmailService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createUser(body: CreateUserDto) {
    try {
      const newId = uuidv4();
      const user = await this._UserRepository.create({
        data: { ...body, _id: newId },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async searchForUserByEmail(email: string) {
    try {
      const user = await this._UserRepository.getUserByEmail(email, {
        _id: true,
        email: true,
        userName: true,
        avatar: true,
        isOnline: true,
        lastSeenAt: true,
      });
      return { message: 'user is fetched', user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllUserDataByEmail(email: string) {
    try {
      const user = await this._UserRepository.getUserByEmail(email);
      return { message: 'user is fetched', user };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getUserById(_id: string) {
    try {
      const user = await this._UserRepository.getUserBy_Id(_id, {
        friends: true,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getUserByEmail(email: string) {
    try {
      const user = await this._UserRepository.getUserByEmail(email, {
        friends: true,
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  async getUserProfile(_id: string) {
    try {
      const user = await this._UserRepository.getUserBy_Id(_id);
      return {
        user: {
          _id: user._id,
          userName: user.userName,
          email: user.email,
          avatar: user.avatar,
          isOline: user.isOnline,
          lastSeenAt: user.lastSeenAt,
        },
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllUsers() {
    const users = await this._UserRepository.getAllUsers();
    return { message: 'All users fetched successfully', users };
  }

  async getFriendsOfCurrentUser(userId: string) {
    const user = await this._UserRepository.getUserBy_Id(userId, {
      friends: true,
    });

    return { friends: user.friends };
  }

  async saveUser(user: User) {
    return this._UserRepository.save(user);
  }

  async validateUser(userId: string, isActive: boolean) {
    try {
      const updatedUser = await this._UserRepository.updateUser(userId, {
        isActive,
      });
      return updatedUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUserProflie(
    file: Express.Multer.File,
    body: UpdateUserProfileDto,
    userId: string,
  ) {
    const user = await this._UserRepository.getUserBy_Id(userId, {
      friends: true,
    });

    if (!user) {
      throw new NotFoundException('user is not found');
    }
    console.log({ body });
    let avatar = {} as { secure_url: string; public_id: string };
    if (file) {
      const { secure_url, public_id } = await this.filesService.uploadFile(
        file,
        {
          folder: `${this._ConfigService.get('CLOUD_APP_FOLDER')}/users/${userId}`,
        },
      );
      avatar = { secure_url, public_id };
    }

    user.avatar = avatar.secure_url || user.avatar;
    user.avatarPublicId = avatar.public_id;

    // Update user profile fields
    if (body.userName) {
      user.userName = body.userName;
    }

    if (body.gender) {
      user.gender = body.gender;
    }
    const updatedUser = await this._UserRepository.save(user);

    if (body.email) {
      const otp = generate(10);
      // set otp in cache manager, that expires after 5 minutes
      await this.cacheManager.set(`${user.email}-otp`, otp, 300000); //300000 ms

      this.MailerEmailService.sendEmail({
        email: user.email,
        subject: 'Verify updating your email',
        html: verifyEmailUpdate(otp, body.email),
      });
    }

    return {
      message: `user is updated successfully ${body.email && '& OTP is sent to your email to confirm the update'}`,
      user: updatedUser,
    };
  }

  async confirmEmailUpdate({
    otp,
    oldEmail,
    newEmail,
  }: {
    otp: string;
    oldEmail: string;
    newEmail: string;
  }) {
    // set otp in cache manager, that expires after 5 minutes
    const getOtp = await this.cacheManager.get(`${oldEmail}-otp`);
    if (!getOtp || getOtp !== otp) {
      console.log({ otp, getOtp });
      throw new BadRequestException('invalid otp');
    }
    const user = await this._UserRepository.findOne({
      where: { email: oldEmail },
    });
    if (!user) {
      throw new NotFoundException('user is not found');
    }
    user.email = newEmail;

    const updatedUser = await this._UserRepository.save(user);
    this.cacheManager.del(`${oldEmail}-otp`);
    return { message: 'email is updated successfully', user: updatedUser };
  }
}
