import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { UserModule } from './../modules/user/user.module';
import { AuthModule } from './../modules/auth/auth.module';
import { ConversationModule } from './../modules/conversation/conversation.module';
import { MessageModule } from './../modules/message/message.module';
import { ConversationMetaDataModule } from './../modules/conversation-meta-data/conversation-meta-data.module';

@Module({
  imports: [
    UserModule,
    AuthModule,
    ConversationModule,
    MessageModule,
    ConversationMetaDataModule,
  ],
  providers: [SocketGateway],
  exports: [SocketGateway],
})
export class SocketModule {}
