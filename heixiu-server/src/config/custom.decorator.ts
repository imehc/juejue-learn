import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { JwtUserData } from './global';

/** 需要登录 */
export const RequireLogin = () => SetMetadata('require-login', true);
/** 获取用户信息 */
export const UserInfo = createParamDecorator(
  (data: keyof JwtUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
