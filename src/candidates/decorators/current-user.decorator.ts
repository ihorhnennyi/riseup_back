import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): HydratedDocument<User> => {
    const request = ctx
      .switchToHttp()
      .getRequest<{ user: HydratedDocument<User> }>();
    return request.user;
  },
);
