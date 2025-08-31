import { AbstractDBRepository } from 'src/DB/db.repository';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Message } from './message.entity';

export class MessageRepository extends AbstractDBRepository<Message> {
  constructor(
    @InjectRepository(Message)
    protected readonly Message: Repository<Message>,
  ) {
    super(Message);
  }

  async getAllMessages() {
    const Messages = await this.repository.find();
    return Messages;
  }

  async create({ data }: { data: Partial<Message> }) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Search for a Message by id
   * @param id
   * @returns Message entity
   */
  async getMessageById(
    id: string,
    relations?: FindOptionsRelations<Message> | undefined,
  ) {
    const Message = await this.repository.findOne({
      where: { id },
      relations,
    });
    if (!Message) {
      throw new NotFoundException('Message not found');
    }

    return Message;
  }

  async updateMessage(
    MessageId: string,
    updateData: Partial<Message>,
  ): Promise<Message> {
    const Message = await this.repository.findOne({
      where: { id: MessageId },
    });

    if (!Message) {
      throw new NotFoundException('Message not found');
    }
    //add updated data to Message entity in DB
    Object.assign(Message, updateData);

    await this.repository.save(Message);
    return Message;
  }

  async save(Message: Message) {
    return await this.repository.save(Message);
  }

  async deleteMsg(msgId: string) {
    return await this.repository.delete({ id: msgId });
  }
}
