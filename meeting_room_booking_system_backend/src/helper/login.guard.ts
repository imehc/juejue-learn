import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { LOGIN_METADATA } from './consts';
import { JwtUserData } from '.';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(Reflector)
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // 用 reflector 从目标 controller 和 handler 上拿到 require-login 的 metadata。
    const requireLogin = this.reflector.getAllAndOverride<boolean>(
      LOGIN_METADATA,
      [context.getClass(), context.getHandler()],
    );
    // 如果没有 metadata，就是不需要登录，返回 true 放行
    if (!requireLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      // throw new UnLoginException('用户未登录');
      throw new UnauthorizedException();
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);

      request.user = {
        userId: data.userId,
        username: data.username,
        email: data.email,
        roles: data.roles,
        permissions: data.permissions,
      };
      return true;
    } catch {
      throw new UnauthorizedException();
      // throw new UnLoginException('token 失效，请重新登录');
    }
  }
}
