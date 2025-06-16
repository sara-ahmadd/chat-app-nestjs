import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SuccessResponse } from './common/interceptors/successResponse.interceptor';
import { ErrorHandler } from './common/interceptors/errorHandler.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new SuccessResponse(), new ErrorHandler());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
