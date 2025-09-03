import { forwardRef, Module } from '@nestjs/common';
import { ConversationMetaDataService } from './conversation-meta-data.service';
import { ConversationMetaDataController } from './conversation-meta-data.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConversationMetaDataRepository } from './conversation-meta-data.repository';
import { UserModule } from '../user/user.module';
import { ConversationMetaData } from './conversation-meta-data.entity';
import { MessageModule } from '../message/message.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => MessageModule),
    TypeOrmModule.forFeature([ConversationMetaData]),
  ],
  controllers: [ConversationMetaDataController],
  providers: [ConversationMetaDataService, ConversationMetaDataRepository],
  exports: [ConversationMetaDataRepository, ConversationMetaDataService],
})
export class ConversationMetaDataModule {}
