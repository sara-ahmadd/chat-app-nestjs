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

@Module({
  imports: [
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
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [User],
          synchronize: false,
        };
      },
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({ isGlobal: true }),

    MessageModule,
    SocketModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
