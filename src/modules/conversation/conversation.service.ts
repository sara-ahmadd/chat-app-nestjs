import { Injectable } from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { User } from '../user/user.entity';
import { Conversation } from './conversation.entity';

@Injectable()
export class ConversationService {
  constructor(
    private readonly _ConversationRepository: ConversationRepository,
  ) {}
  async createNewConversation(data: Partial<Conversation>) {
    const newConversation = await this._ConversationRepository.create({ data });
    return newConversation;
  }
  async getConversationByParticipants(sender: User, receiver: User) {
    const conversation =
      await this._ConversationRepository.getConversationByParticipants([
        sender,
        receiver,
      ]);
    return conversation;
  }
}
