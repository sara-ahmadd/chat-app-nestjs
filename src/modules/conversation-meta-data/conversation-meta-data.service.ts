import { Injectable } from '@nestjs/common';
import { ConversationMetaDataRepository } from './conversation-meta-data.repository';
import { UserService } from '../user/user.service';
import { Message } from '../message/message.entity';
import { User } from '../user/user.entity';
import { Conversation } from '../conversation/conversation.entity';

@Injectable()
export class ConversationMetaDataService {
  constructor(
    private readonly _ConversationMetaDataRepository: ConversationMetaDataRepository,
    private readonly _UserService: UserService,
  ) {}

  async getLastReadMsg(userId: string, convId: string) {
    return this._ConversationMetaDataRepository.getLastReadMsg(userId, convId);
  }

  async updateLastReadMsg(
    user: User,
    conv: Conversation,
    lastSeenMsg: Message,
  ) {
    return this._ConversationMetaDataRepository.updateLastReadMsg(
      user,
      conv,
      lastSeenMsg,
    );
  }

  //count the unread messages
  async getUnReadMsgs(userId: string, convId: string) {
    return this._ConversationMetaDataRepository.countUnReadMsgs(userId, convId);
  }
}
