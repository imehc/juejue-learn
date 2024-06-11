import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { PERMISSION_METADATA } from './helper/consts';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    if (!request.user) {
      return true;
    }

    const permissions = request.user.permissions;
    // 用 reflector 取出 handler 或者 controller 上的 require-permission 的 metadata
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSION_METADATA,
      [context.getClass(), context.getHandler()],
    );

    if (!requiredPermissions) {
      return true;
    }
    // 对于需要的每个权限，检查下用户是否拥有，没有的话就返回 401，提示没权限
    for (let i = 0; i < requiredPermissions.length; i++) {
      const curPermission = requiredPermissions[i];
      const found = permissions.find((item) => item.code === curPermission);
      if (!found) {
        throw new UnauthorizedException('您没有访问该接口的权限');
      }
    }

    return true;
  }
}
