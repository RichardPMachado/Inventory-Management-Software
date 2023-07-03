import { User } from 'src/user/entities/user.entity';

import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { IAuthRequest } from '../auth/models/IAuthRequest';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request = context.switchToHttp().getRequest<IAuthRequest>();

    return request.user;
  },
);
