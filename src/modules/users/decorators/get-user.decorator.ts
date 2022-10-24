import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { authConstant } from 'src/auth/auth.constants';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (data === authConstant.jwtAccessToken) {
      return request.headers.authorization.substr(7);
    }
    return data ? user?.[data] : user;
  },
);
