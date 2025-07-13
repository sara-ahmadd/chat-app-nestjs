import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './modules/message/message.module';
import { AuthModule } from './modules/auth/auth.module';
import { User } from './modules/user/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthGuard } from './common/guards/auth.guard';
import { SocketModule } from './socket/socket.module';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from './common/providers/cloudinary.module';
import { ConversationModule } from './modules/conversation/conversation.module';
import { Conversation } from './modules/conversation/conversation.entity';
import { Message } from './modules/message/message.entity';

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
          entities: [User, Conversation, Message],
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
