import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { Message } from './message.entity';

@Injectable()
export class MessageService {
  constructor(private readonly _MessageRepository: MessageRepository) {}

  async createNewMessage(data: Partial<Message>) {
    const newMessage = await this._MessageRepository.create({ data });
    return newMessage;
  }
}
