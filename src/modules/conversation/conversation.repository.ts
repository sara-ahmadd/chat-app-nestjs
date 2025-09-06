import { FindOptionsRelations, In, Repository } from 'typeorm';
import { AbstractDBRepository } from './../../DB/db.repository';

import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
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
      order: {
        messages: { createdAt: 'ASC' },
      },
    });
    if (!Conversation) {
      throw new NotFoundException('Conversation not found');
    }

    return Conversation;
  }

  /**
   * Search for all Conversations of a certain participant
   * @param user
   * @returns Conversation entity
   */
  async getConversationsOfAParticipant(user: User) {
    //get the targetted conversation
    const conversations = await this.repository
      .createQueryBuilder('conversation')
      // .select(['conversation.id']) //get the id column only from conversation
      .leftJoin('conversation.participants', 'participant') //join to participants(users table)
      .where('participant.id = :id', {
        id: user.id,
      })
      .groupBy('conversation.id')
      // .having('COUNT(participant.id) = :usersCount', { usersCount })
      .getMany();
    // get the whole convrsation with messages & participants data
    const convIds = conversations.map((c) => c.id);
    const fullConversation = await this.repository.find({
      where: { id: In(convIds) },
      relations: {
        participants: true,
        messages: {
          conversation: true,
          sentBy: true,
        },
      },
      order: {
        messages: { createdAt: 'ASC' },
      },
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

  // save  conversation
  async save(conversation: Conversation) {
    return await this.repository.save(conversation);
  }

  //delete conversation
  async deleteConv(conversation: Conversation) {
    return await this.repository.delete({ id: conversation.id });
  }
}
