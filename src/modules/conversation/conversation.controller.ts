import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { User } from './../../common/decorators/user.decorator';
import { ConversationService } from './conversation.service';
import { AddParticipantsToGroupDto } from './dtos/add-participants.dto';
import { CreateGroupDto } from './dtos/create-group.dto';
import { User as UserEntity } from '../user/user.entity';

@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}
  @Post('/create_group')
  async createChatRoom(
    @Body() { title, users }: CreateGroupDto,
    @User('_id') creatorId: string,
  ) {
    return this.conversationService.createGroupConversation({
      title,
      users,
      creatorId,
    });
  }
  @Post('/add_users')
  async addParticipantsToGroup(
    @Body() { convId, users }: AddParticipantsToGroupDto,
    @User('_id') currentUserId: string,
  ) {
    return this.conversationService.addParticipantsToGroup({
      convId,
      users,
      currentUserId,
    });
  }
  @Patch('/exit_group')
  async removeUserFromGroupChat(
    @Body() body: { convId: string; targetUserId: string },
    @User() currentUser: UserEntity,
  ) {
    return this.conversationService.exitGroupChat(
      body.convId,
      body.targetUserId,
      currentUser,
    );
  }
}
