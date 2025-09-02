import { AbstractDBRepository } from 'src/DB/db.repository';
import { FindOptionsRelations, In, Repository } from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { ConversationMetaData } from './conversation-meta-data.entity';
import { Message } from '../message/message.entity';

export class ConversationMetaDataRepository extends AbstractDBRepository<ConversationMetaData> {
  constructor(
    @InjectRepository(ConversationMetaData)
    protected readonly ConversationMetaData: Repository<ConversationMetaData>,
  ) {
    super(ConversationMetaData);
  }

  //GET last read message by specific user in specific conversation

  async getLastReadMsg(userId: string, convId: string) {
    const msg = await this.repository.findOne({
      where: { user: { _id: userId }, conversation: { id: convId } },
    });

    if (!msg)
      throw new NotFoundException('Message is not found / not read yet');

    return msg;
  }

  //UPDATE last read message by specific user in specific conversation
  async updateLastReadMsg(
    userId: string,
    convId: string,
    lastSeenMsg: Message,
  ) {
    const msg = await this.getLastReadMsg(userId, convId);

    msg.lastReadMessage = lastSeenMsg;

    await this.repository.save(msg);

    return msg;
  }
}
