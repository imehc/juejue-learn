import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { JwtUserData } from '../helper/global';
import { ConfigService } from '@nestjs/config';
import { ConfigurationImpl } from 'src/helper/configuration';
import { RedisService } from 'src/redis/redis.service';
import { jwtWrapper } from 'src/helper/helper';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService<ConfigurationImpl>,
  ) {}

  @Inject()
  private reflector: Reflector;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
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

    type JWTData = JwtUserData & { exp: number };
    try {
      const token = authorization.split(' ')[1];
      const data = await this.jwtService.verifyAsync<JWTData>(token, {
        secret: this.configService.get('jwt.access-token-secret'),
      });
      const cacheExp = await this.redisService.get(jwtWrapper(data.userId));
      if (+cacheExp === data.exp) {
        request.user = data;
        return true;
      }
      throw new Error('已过期'); // 只需要抛出错误即可
    } catch (error) {
      throw new UnauthorizedException('登录已失效');
    }
  }
}
