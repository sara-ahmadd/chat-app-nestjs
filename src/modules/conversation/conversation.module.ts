import { forwardRef, Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { ConversationRepository } from './conversation.repository';
import { Conversation } from './conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/common/decorators/user.decorator';
import { UserModule } from '../user/user.module';

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
