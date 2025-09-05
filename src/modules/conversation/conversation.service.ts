import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { Conversation } from './conversation.entity';
import { ConversationRepository } from './conversation.repository';
import { Roles } from './../../common/types/userRolesEnum';

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

  async getConversationsOfAParticipant(sender: User) {
    const conversations =
      await this._ConversationRepository.getConversationsOfAParticipant(sender);
    return conversations;
  }

  async getConversationById(id: string) {
    const conversation = await this._ConversationRepository.getConversationById(
      id,
      { participants: true, messages: { sentBy: true } },
    );
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
    creatorId,
  }: {
    title: string;
    users?: string[];
    creatorId: string;
  }) {
    //get users data by thier emails
    if (!users || users.length == 0) return;

    //make the creator an admin
    const creator = await this._UserService.getUserById(creatorId);
    const usersData: User[] = [creator];
    creator.role = Roles.ADMIN;
    await this._UserService.saveUser(creator);

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

  //add new member to an existing group
  async addParticipantsToGroup({
    users,
    convId,
    currentUserId,
  }: {
    users: string[];
    convId: string;
    currentUserId: string;
  }) {
    //get users data by thier emails
    if (!users || users.length == 0) return;
    const conversation = await this.getConversationById(convId);
    if (!conversation) {
      throw new NotFoundException('conversation is not found!');
    }
    const currUserData = await this._UserService.getUserById(currentUserId);

    if (
      currUserData.role?.toLowerCase() === Roles.ADMIN?.toLowerCase() &&
      conversation.participants?.map((p) => p._id).includes(currentUserId)
    ) {
      const usersData: User[] = [];
      for (const user of users) {
        const userData = await this._UserService.getUserByEmail(user);
        if (
          conversation?.participants
            .map((u) => u.email)
            .includes(userData.email)
        ) {
          throw new BadRequestException('user already exists in that group');
        }
        usersData.push(userData);
      }
      const updatedConversation = await this.updateConversation(convId, {
        participants: [...conversation?.participants, ...usersData],
      });
      return updatedConversation;
    } else {
      throw new BadRequestException(
        'You are not authorized to add users to this group',
      );
    }
  }

  async deleteConversation(convId: string) {}

  /**
   * admin remove a member from a chat group or the user exits the group
   * @param convId Conversation Id
   * @param user_Id Target user _id (the user to be removed from the chat group)
   * @param currentUserId
   */

  async exitGroupChat(convId: string, user_Id: string, currentUser: User) {
    const conversation = await this.getConversationById(convId);
    if (!conversation) {
      throw new NotFoundException('conversation is not found!');
    }
    const userData = await this._UserService.getUserById(user_Id);
    if (!userData) {
      throw new NotFoundException('user is not found!');
    }
    const currUserData = await this._UserService.getUserById(currentUser._id);
    if (
      currUserData.role?.toLowerCase() == Roles.ADMIN?.toLowerCase() &&
      conversation.participants?.map((p) => p._id).includes(currentUser._id)
    ) {
      this.deleteMemberFromConversation(userData._id, conversation);
      return {
        message: `${userData.userName} is removed by admin ${currentUser.userName}`,
      };
    } else if (currentUser._id.toString() === userData._id.toString()) {
      this.deleteMemberFromConversation(userData._id, conversation);
      return {
        message: `${userData.userName} Exited the group`,
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async deleteMemberFromConversation(user_Id: string, conv: Conversation) {
    const updateParticipants = conv.participants.filter(
      (p) => p._id !== user_Id,
    );
    return this._ConversationRepository.updateConversation(conv.id, {
      participants: updateParticipants,
    });
  }
}
