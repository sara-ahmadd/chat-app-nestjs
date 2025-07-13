import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER, CacheModule } from '@nestjs/cache-manager';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { JWTFunctions } from 'src/common/services/jwt-service.service';
import { MailerEmailService } from 'src/common/services/mailer.service';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return { secret: configService.get('JWT_SECRET'), global: true };
      },
      inject: [ConfigService],
      global: true,
    }),
    forwardRef(() => UserModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    { provide: APP_GUARD, useClass: AuthGuard },
    JWTFunctions,
    MailerEmailService,
  ],
  exports: [JWTFunctions, MailerEmailService],
})
export class AuthModule {}
