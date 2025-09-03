import { forwardRef, Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { UserModule } from '../user/user.module';
import { ConversationMetaDataModule } from '../conversation-meta-data/conversation-meta-data.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => UserModule),
    forwardRef(() => ConversationMetaDataModule),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}
