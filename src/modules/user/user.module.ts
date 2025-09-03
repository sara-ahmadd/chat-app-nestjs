import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesService } from 'src/common/services/files.service';
import { AuthModule } from '../auth/auth.module';
import { ConversationMetaDataModule } from '../conversation-meta-data/conversation-meta-data.module';
import { ConversationModule } from '../conversation/conversation.module';
import { UserController } from './user.controller';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ConversationMetaDataModule),
    forwardRef(() => AuthModule),
    forwardRef(() => ConversationModule),
  ],
  controllers: [UserController],
  providers: [UserService, UserRepository, FilesService],
  exports: [UserService, UserRepository, FilesService],
})
export class UserModule {}
