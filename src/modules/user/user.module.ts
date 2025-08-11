import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { FilesService } from 'src/common/services/files.service';
import { AuthModule } from '../auth/auth.module';
import {
  Cloudinary,
  CLOUDINARY,
} from 'src/common/providers/fileCloudServices/cloudinary.provider';
import { ConversationModule } from '../conversation/conversation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    forwardRef(() => ConversationModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, FilesService],
  exports: [UserService, UserRepository, FilesService],
})
export class UserModule {}
