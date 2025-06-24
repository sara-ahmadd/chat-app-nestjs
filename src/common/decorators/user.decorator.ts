import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest();
    return data ? req.user[data] : req.user;
  },
);
