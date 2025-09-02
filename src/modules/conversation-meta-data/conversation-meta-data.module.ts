import { Module } from '@nestjs/common';
import { ConversationMetaDataService } from './conversation-meta-data.service';
import { ConversationMetaDataController } from './conversation-meta-data.controller';

@Module({
  controllers: [ConversationMetaDataController],
  providers: [ConversationMetaDataService],
})
export class ConversationMetaDataModule {}
