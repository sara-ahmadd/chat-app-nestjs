import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private JWTService: JwtService,
    private readonly reflector: Reflector,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      context.getHandler(),
      context.getClass(),
    ]);
    try {
      if (isPublic) return true;
      const ctx = context.switchToHttp();
      const req = ctx.getRequest();
      const token = this.extractTokenFromHeaders(req);
      const { _id, email } = await this.JWTService.verifyAsync(token);
      req['user'] = { _id, email };
      return true;
    } catch (error) {
      throw new BadRequestException('Expired/Invalid token !!');
    }
  }

  extractTokenFromHeaders(req: Request) {
    const auth = req.headers.authorization?.split(' ');
    if (auth?.[0] !== 'Bearer' || !auth?.[1]) {
      throw new BadRequestException('invalid token');
    }
    return auth[1];
  }
}
