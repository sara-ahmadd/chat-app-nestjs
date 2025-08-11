import { AbstractDBRepository } from 'src/DB/db.repository';
import { FindOptionsRelations, FindOptionsSelect, Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { User } from '../user/user.entity';

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

    // TypeORM's `create()` method does not automatically assign relational fields (like ManyToMany).
    // Even if `data.participants` is present, it might not be assigned to the entity properly.
    // Therefore, we explicitly assign `participants` to ensure the relationship is recognized and persisted.
    if (data.participants && data.participants.length > 0) {
      entity.participants = data.participants;
    }

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
  /**
   * Search for a Conversation by participants Ids
   * @param usersIds
   * @returns Conversation entity
   */
  async getConversationByParticipants(users: User[]) {
    const usersIds = users.map((user) => user.id);
    const usersCount = users.length;
    const conversation = await this.repository
      .createQueryBuilder('conversation')
      .select('conversation.id')
      .leftJoin('conversation.participants', 'participant')
      .where('participant.id IN (:...usersIds)', {
        usersIds,
      })
      .groupBy('conversation.id')
      .getOne();

    return conversation;
  }
  async getWholeChat(users: User[]) {
    const usersIds = users.map((user) => user.id);
    const usersCount = users.length;
    const conversation = await this.repository
      .createQueryBuilder('conversation')
      .select('conversation.id')
      .leftJoin('conversation.participants', 'participant')
      .where('participant.id IN (:...usersIds)', {
        usersIds,
      })
      .groupBy('conversation.id')
      .having('COUNT(participant.id) = :usersCount', { usersCount })
      .getOne();

    const fullConversation = await this.repository.find({
      where: { id: conversation?.id },
      relations: ['participants'],
    });
    return fullConversation;
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
