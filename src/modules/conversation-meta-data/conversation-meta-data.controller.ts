import { Controller } from '@nestjs/common';
import { ConversationMetaDataService } from './conversation-meta-data.service';

@Controller('conversation-meta-data')
export class ConversationMetaDataController {
  constructor(private readonly conversationMetaDataService: ConversationMetaDataService) {}
}
