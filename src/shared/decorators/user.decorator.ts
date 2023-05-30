import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

import { User } from '../dal';

interface RequestWithUser extends Request {
  user?: User;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const RequestUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const request: RequestWithUser = context.switchToHttp().getRequest();

    return request.user;
  },
);
