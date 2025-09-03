import { AbstractDBRepository } from 'src/DB/db.repository';
import { FindOptionsRelations, In, Repository } from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { ConversationMetaData } from './conversation-meta-data.entity';
import { Message } from '../message/message.entity';
import { MessageRepository } from '../message/message.repository';
import { Conversation } from '../conversation/conversation.entity';

export class ConversationMetaDataRepository extends AbstractDBRepository<ConversationMetaData> {
  constructor(
    @InjectRepository(ConversationMetaData)
    protected readonly ConversationMetaData: Repository<ConversationMetaData>,
    private _MessageRepo: MessageRepository,
  ) {
    super(ConversationMetaData);
  }

  //GET last read message by specific user in specific conversation

  async getLastReadMsg(userId: string, convId: string) {
    const msg = await this.repository.findOne({
      where: { user: { _id: userId }, conversation: { id: convId } },
    });

    return msg;
  }

  //create new last read message
  async newLastReadMsg(user: User, conv: Conversation) {
    return this.repository.create({ user, conversation: conv });
  }

  //UPDATE last read message by specific user in specific conversation
  async updateLastReadMsg(
    user: User,
    conv: Conversation,
    lastSeenMsg: Message,
  ) {
    let msg = await this.getLastReadMsg(user._id, conv.id);
    if (!msg) {
      msg = await this.newLastReadMsg(user, conv);
    }
    msg.lastReadMessage = lastSeenMsg;

    await this.repository.save(msg);

    return msg;
  }

  //count unread messages
  async countUnReadMsgs(userId: string, convId: string) {
    //get timestamp of last read message
    const lastRead = (await this.getLastReadMsg(userId, convId))
      ?.lastReadMessage.createdAt;
    if (!lastRead) {
      console.log('Message is not found');
      throw new NotFoundException('Message is not found / not read yet');
    }
    //get all messages in this conversation which their date/time is after time of laste read msg
    const msgs = await this._MessageRepo.getUnReadMsgs(convId, lastRead);
    return msgs.length;
  }
}
