import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { UserService } from 'src/modules/user/user.service';
@Injectable()
export class JWTFunctions {
  constructor(
    private readonly JWTService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  generateAccessToken(payload: { _id: string; email: string }) {
    const token = this.JWTService.sign(payload, {
      expiresIn: this.configService.get<string>('ACCESS_TOKEN_EXPIRES_IN'),
    });
    return token;
  }
  generateRefreshToken(payload: { _id: string; email: string }) {
    const token = this.JWTService.sign(payload, {
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN'),
    });
    return token;
  }
  decodeToken(token: string): {
    _id: string;
    email: string;
    [key: string]: any;
  } {
    const payload = this.JWTService.decode(token);
    return payload;
  }
  async verifyToken(token: string) {
    try {
      const { _id, email } = await this.JWTService.verifyAsync(token);
      return { _id, email };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
