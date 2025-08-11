import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { User } from '../user/user.entity';
import { CreateGroupDto } from './dtos/create-group.dto';
import { AddParticipantsToGroupDto } from './dtos/add-participants.dto';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post('/create_group')
  async createChatRoom(@Body() { title, users }: CreateGroupDto) {
    return this.conversationService.createGroupConversation({ title, users });
  }
  @Post('/add_users')
  async addParticipantsToGroup(
    @Body() { convId, users }: AddParticipantsToGroupDto,
  ) {
    return this.conversationService.addParticipantsToGroup({ convId, users });
  }
}
