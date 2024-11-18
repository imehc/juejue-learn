import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtUserData } from './config/global';

@Injectable()
export class AuthGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    // const response: Response = context.switchToHttp().getResponse();

    const requiredLogin = this.reflector.getAllAndOverride<boolean>(
      'require-login',
      [context.getHandler(), context.getClass()],
    );
    if (!requiredLogin) {
      return true;
    }

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('登录已过期');
    }

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<JwtUserData>(token);
      request.user = data;
      return true;
    } catch (error) {
      throw new UnauthorizedException('登录已失效');
    }
  }
}
