import { AbstractDBRepository } from 'src/DB/db.repository';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Conversation } from './conversation.entity';

export class ConversationRepository extends AbstractDBRepository<Conversation> {
  constructor(
    @InjectRepository(Conversation)
    protected readonly Conversation: Repository<Conversation>,
  ) {
    super(Conversation);
  }

  async getAllConversations() {
    const Conversations = await this.repository.find();
    return Conversations;
  }

  async create({ data }: { data: Partial<Conversation> }) {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  /**
   * Search for a Conversation by id
   * @param id
   * @returns Conversation entity
   */
  async getConversationById(
    id: string,
    relations?: FindOptionsRelations<Conversation> | undefined,
  ) {
    const Conversation = await this.repository.findOne({
      where: { id },
      relations,
    });
    if (!Conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return Conversation;
  }

  async updateConversation(
    ConversationId: string,
    updateData: Partial<Conversation>,
  ): Promise<Conversation> {
    const Conversation = await this.repository.findOne({
      where: { id: ConversationId },
    });

    if (!Conversation) {
      throw new NotFoundException('Conversation not found');
    }
    //add updated data to Conversation entity in DB
    Object.assign(Conversation, updateData);

    await this.repository.save(Conversation);
    return Conversation;
  }

  async save(Conversation: Conversation) {
    return await this.repository.save(Conversation);
  }
}
