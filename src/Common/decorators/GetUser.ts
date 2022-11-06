import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { Request } from 'express';

export const GetUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const req: Request = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
