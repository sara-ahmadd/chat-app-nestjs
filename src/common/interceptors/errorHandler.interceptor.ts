import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable } from 'rxjs';

@Injectable()
export class ErrorHandler implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    return next.handle().pipe(
      catchError((error) => {
        if (error instanceof HttpException) {
          throw new HttpException(error, error.getStatus());
        }
        const newRes = {
          status: 'Error',
          message: error.message,
          stack: error.stack,
        };

        throw new HttpException(newRes, error.getStatus());
      }),
    );
  }
}
