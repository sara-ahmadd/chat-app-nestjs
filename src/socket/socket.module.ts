import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UserModule } from 'src/modules/user/user.module';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConversationModule } from 'src/modules/conversation/conversation.module';
import { MessageModule } from 'src/modules/message/message.module';

@Module({
  imports: [UserModule, AuthModule, ConversationModule, MessageModule],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
