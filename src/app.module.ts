import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CloudinaryModule } from './common/providers/cloudinary.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConversationMetaDataModule } from './modules/conversation-meta-data/conversation-meta-data.module';
import { Conversation } from './modules/conversation/conversation.entity';
import { ConversationModule } from './modules/conversation/conversation.module';
import { Message } from './modules/message/message.entity';
import { MessageModule } from './modules/message/message.module';
import { User } from './modules/user/user.entity';
import { SocketModule } from './socket/socket.module';
import { ConversationMetaData } from './modules/conversation-meta-data/conversation-meta-data.entity';

@Module({
  imports: [
    CloudinaryModule,
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          transport: {
            host: configService.get('EMAIL_HOST'),
            auth: {
              user: configService.get('EMAIL_USERNAME'),
              pass: configService.get('EMAIL_PASSWORD'),
            },
          },
        };
      },
      inject: [ConfigService],
    }),

    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE') as
            | 'mysql'
            | 'postgres'
            | 'sqlite'
            | 'mariadb'
            | 'mongodb',
          host: configService.get<string>('DB_HOST'),
          port: Number(configService.get<string>('DB_PORT')),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_NAME'),
          entities: [User, Conversation, Message, ConversationMetaData],
          synchronize: false,
        };
      },

      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    MessageModule,
    SocketModule,
    AuthModule,
    ConversationModule,
    ConversationMetaDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
