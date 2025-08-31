import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Roles } from 'src/common/types/userRolesEnum';
import { Message } from './message.entity';
import { MessageRepository } from './message.repository';
import { UserService } from '../user/user.service';
import { FilesService } from 'src/common/services/files.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessageService {
  constructor(
    private readonly _MessageRepository: MessageRepository,
    private _UserService: UserService,
    private readonly filesService: FilesService,
    private readonly _ConfigService: ConfigService,
  ) {}

  async createNewMessage(data: Partial<Message>) {
    const newMessage = await this._MessageRepository.create({ data });
    return newMessage;
  }

  // delete msg either by its sender or by the admin (in case of group chat)
  async deleteMessage(msgId: string, currentUserId: string) {
    //get the message
    const message = await this._MessageRepository.getMessageById(msgId, {
      sentBy: true,
      conversation: true,
    });
    // if the sender id equals to currentUser id enable him to delete it , therwise user is not autorized to do this
    if (message.sentBy?._id.toString() === currentUserId.toString()) {
      await this._MessageRepository.deleteMsg(msgId);
      return { message: 'Message is deleted successfully' };
    } else {
      //if the message is in group make the admin also be able to delete it
      if (message.conversation?.isGroup) {
        const currUser = await this._UserService.getUserById(currentUserId);
        if (currUser.role?.toLowerCase() === Roles.ADMIN?.toLowerCase()) {
          await this._MessageRepository.deleteMsg(msgId);
          return { message: 'Message is deleted successfully by group admin' };
        } else {
          throw new UnauthorizedException(
            'You are not authorized to delete this message',
          );
        }
      }
    }
  }

  //update message by its owner only
  async updateMsg(
    msgId: string,
    data: Partial<Message>,
    currentUserId: string,
    file?: Express.Multer.File,
  ) {
    //get the message
    const message = await this._MessageRepository.getMessageById(msgId, {
      sentBy: true,
      conversation: true,
    });
    if (message.sentBy._id.toString() !== currentUserId.toString()) {
      throw new UnauthorizedException(
        'you are not suthorized to update this message',
      );
    }

    if (file) {
      this.filesService.deleteFile(message.contentImgPublicId);
      const { secure_url, public_id } = await this.filesService.uploadFile(
        file,
        {
          folder: `${this._ConfigService.get('CLOUD_APP_FOLDER')}/messagesImages/}`,
        },
      );
      data.contentImgUrl = secure_url;
      data.contentImgPublicId = public_id;
    }
    await this._MessageRepository.updateMessage(msgId, data);
    return { message: 'image is updated successfully' };
  }
}
