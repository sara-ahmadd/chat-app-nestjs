import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConversationRepository } from './conversation.repository';
import { User } from '../user/user.entity';
import { Conversation } from './conversation.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class ConversationService {
  constructor(
    private readonly _ConversationRepository: ConversationRepository,
    private readonly _UserService: UserService,
  ) {}
  async createNewConversation(data: Partial<Conversation>) {
    const newConversation = await this._ConversationRepository.create({ data });
    return newConversation;
  }
  async getConversationByParticipants(users: User[]) {
    console.log({ users });
    const conversation =
      await this._ConversationRepository.getConversationByParticipants(users);
    return conversation;
  }
  async getConversationsOfAParticipant(sender: User) {
    const conversations =
      await this._ConversationRepository.getConversationsOfAParticipant(sender);
    return conversations;
  }
  async getConversationById(id: string) {
    const conversation = await this._ConversationRepository.getConversationById(
      id,
      { participants: true },
    );
    return conversation;
  }
  async getWholeChat(sender: User, receiver: User) {
    const conversation = await this._ConversationRepository.getWholeChat([
      sender,
      receiver,
    ]);
    return conversation;
  }
  async getGroupChat(convId: string) {
    const conversation =
      await this._ConversationRepository.getGroupChat(convId);
    return conversation;
  }

  async updateConversation(
    conversationId: string,
    data: Partial<Conversation>,
  ) {
    return this._ConversationRepository.updateConversation(
      conversationId,
      data,
    );
  }
  //create chat room among many participants
  async createGroupConversation({
    title,
    users,
  }: {
    title: string;
    users?: string[];
  }) {
    //get users data by thier emails
    if (!users || users.length == 0) return;
    const usersData: User[] = [];
    for (const user of users) {
      const userData = await this._UserService.getUserByEmail(user);
      usersData.push(userData);
    }
    const chatRoom = await this.createNewConversation({
      title,
      participants: [...(usersData || [])],
      isGroup: true,
    });
    return chatRoom;
  }

  //add new users to the group
  async addParticipantsToGroup({
    users,
    convId,
  }: {
    users: string[];
    convId: string;
  }) {
    //get users data by thier emails
    if (!users || users.length == 0) return;
    const conversation = await this.getConversationById(convId);
    if (!conversation) {
      throw new NotFoundException('conversation is not found!');
    }
    const usersData: User[] = [];
    for (const user of users) {
      const userData = await this._UserService.getUserByEmail(user);
      if (
        conversation?.participants.map((u) => u.email).includes(userData.email)
      ) {
        throw new BadRequestException('user already exists in that group');
      }
      usersData.push(userData);
    }
    const updatedConversation = await this.updateConversation(convId, {
      participants: [...conversation?.participants, ...usersData],
    });
    return updatedConversation;
  }
}
