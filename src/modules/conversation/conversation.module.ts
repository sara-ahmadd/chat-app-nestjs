import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { ConversationController } from './conversation.controller';
import { Conversation } from './conversation.entity';
import { ConversationRepository } from './conversation.repository';
import { ConversationService } from './conversation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation]),
    forwardRef(() => UserModule),
  ],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
  exports: [ConversationRepository, ConversationService],
})
export class ConversationModule {}
