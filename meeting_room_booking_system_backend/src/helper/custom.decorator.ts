import {
  ExecutionContext,
  SetMetadata,
  createParamDecorator,
} from '@nestjs/common';
import { LOGIN_METADATA, PERMISSION_METADATA } from './consts';

export const RequireLogin = () => SetMetadata(LOGIN_METADATA, true);

export const RequirePermission = (...permissions: string[]) =>
  SetMetadata(PERMISSION_METADATA, permissions);

/** 自定义参数装饰器 */
export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();

    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
