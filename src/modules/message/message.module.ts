import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { MessageRepository } from './message.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './message.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), UserModule],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageRepository, MessageService],
})
export class MessageModule {}
