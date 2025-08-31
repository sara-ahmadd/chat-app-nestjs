import { AbstractDBRepository } from 'src/DB/db.repository';
import {
  FindOptionsRelations,
  FindOptionsSelect,
  In,
  Repository,
} from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Conversation } from './conversation.entity';
import { User } from '../user/user.entity';
import { decryptEmojieText } from 'src/utils/helpers/encryptEmojiesText';

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
    // const usersIds = users.map((user) => user.id);
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

  // async getWholeChat(users: User[]) {
  //   const usersIds = users.map((user) => user.id);
  //   const usersCount = users.length;
  //   //get the targetted conversation
  //   const conversation = await this.repository
  //     .createQueryBuilder('conversation')

  //     .leftJoin('conversation.participants', 'user') //join to participants(users table)

  //     .where('user.id IN (:...usersIds)', {
  //       usersIds,
  //     })
  //     .groupBy('conversation.id')
  //     .having('COUNT(user .id) = :usersCount', { usersCount })
  //     .getOne();
  //   // get the whole convrsation with messages & participants data
  //   const fullConversation = await this.repository.findOne({
  //     where: { id: conversation?.id },
  //     relations: {
  //       participants: true,
  //       messages: {
  //         conversation: true,
  //         sentBy: true,
  //       },
  //     },
  //     order: {
  //       messages: { createdAt: 'ASC' },
  //     },
  //   });
  //   console.log({ fullConversation_whole_chat: fullConversation });
  //   return fullConversation;
  // }
  // get chat of a group

  // async getGroupChat(convId: string) {
  //   // const conv = await this.repository
  //   //   .createQueryBuilder('conversation')
  //   //   .leftJoin('conversation.messages', 'message')
  //   //   .leftJoin('conversation.participants', 'user')
  //   //   .where('conversation.id = :id', { id: convId })
  //   //   .getOne();
  //   const fullConversation = await this.repository.findOne({
  //     where: { id: convId },
  //     relations: { participants: true, messages: { sentBy: true } },
  //     order: { messages: { createdAt: 'ASC' } },
  //   });

  //   return fullConversation;
  // }
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
