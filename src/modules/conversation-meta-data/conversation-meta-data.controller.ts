import { Body, Controller, Get, Patch } from '@nestjs/common';
import { ConversationMetaDataService } from './conversation-meta-data.service';
import { User } from 'src/common/decorators/user.decorator';

@Controller('conversation-meta-data')
export class ConversationMetaDataController {
  constructor(
    private readonly conversationMetaDataService: ConversationMetaDataService,
  ) {}

  @Get('/last_read')
  async getLastReadMsg(
    @Body() body: { convId: string },
    @User('_id') userId: string,
  ) {
    return this.conversationMetaDataService.getLastReadMsg(userId, body.convId);
  }

  //count the unread messages
  @Get('/unread_count')
  async getUnReadCount(
    @Body() body: { convId: string },
    @User('_id') userId: string,
  ) {
    return this.conversationMetaDataService.getUnReadMsgs(userId, body.convId);
  }
}
