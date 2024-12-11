import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { User } from '@prisma/client';
import {
  forgetPasswordWrapper,
  jwtRefreshWrapper,
  jwtWrapper,
  registerWrapper,
} from 'src/helper/helper';
import { md5, noop } from 'src/helper/utils';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { type ConfigurationImpl } from 'src/helper/configuration';
import ms from 'ms';
import { testByUser } from './auth.test';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<ConfigurationImpl>,
    private readonly jwtService: JwtService,
  ) {}

  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisServer: RedisService;

  private readonly logger = new Logger();

  public async register({ captcha, ...data }: RegisterDto) {
    const cacheCaptcha = await this.redisServer.get(
      registerWrapper(data.email),
    );
    if (!cacheCaptcha) {
      throw new BadRequestException('验证码失效');
    }
    if (captcha !== cacheCaptcha) {
      throw new BadRequestException('验证码错误');
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (foundUser) {
      throw new BadRequestException('该邮箱已存在');
    }

    const checkUserName = await this.prismaService.user.findFirst({
      where: { username: data.username },
    });

    if (checkUserName) {
      throw new BadRequestException('用户名不能重复');
    }

    try {
      const user = await this.prismaService.user.create({
        data: { ...data, password: md5(data.password) },
        select: {
          id: true,
          username: true,
          email: true,
          /** 只返回选择的字段 */
        },
      });
      return user;
    } catch (error) {
      this.logger.error(error, AuthService.name);
      throw new InternalServerErrorException('服务异常');
    } finally {
      this.redisServer.del(registerWrapper(data.email));
    }
  }

  public async login(loginDto: LoginDto) {
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        username: loginDto.username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!foundUser) {
      throw new BadRequestException('用户不存在');
    }

    const { password, ...user } = foundUser;
    if (password !== md5(loginDto.password)) {
      throw new BadRequestException('密码错误');
    }

    return user;
  }

  /** 这里指的是登出 */
  public async logout(userId: number) {
    const cacheExp = await this.redisServer.get(jwtWrapper(userId));
    const cacheRExp = await this.redisServer.get(jwtRefreshWrapper(userId));
    if (!cacheExp || !cacheRExp) {
      throw new BadRequestException('已退出登录,请勿重复退出');
    }
    await this.redisServer.del(jwtWrapper(userId));
    await this.redisServer.del(jwtRefreshWrapper(userId));
  }

  public async updateUser(config: UpdateConfig) {
    const foundUser = await this.prismaService.user.findUnique({
      where: { email: config.data.email },
    });
    if (!foundUser) {
      throw new BadRequestException('邮箱不存在');
    }
    const cacheCaptcha = await this.redisServer.get(
      forgetPasswordWrapper(config.data.email),
    );
    if (!cacheCaptcha) {
      throw new BadRequestException('验证码失效');
    }
    if (cacheCaptcha !== config.captcha) {
      throw new BadRequestException('验证码错误');
    }
    try {
      await this.prismaService.user.update({
        where: { email: config.data.email },
        data: { password: md5(config.data.password) },
      });
    } catch (error) {
      this.logger.error(error, AuthService.name);
      throw new InternalServerErrorException('服务异常');
    } finally {
      this.redisServer.del(forgetPasswordWrapper(config.data.email));
    }
  }

  public async getTokens(userId: number, username: string) {
    // TODO: 检测该用户是否被禁止登录
    const expiresIn = this.configService.get('jwt.access-token-expires-time');
    const rExpiresIn = this.configService.get('jwt.refresh-token-expires-time');
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { userId, username },
        {
          secret: this.configService.get('jwt.access-token-secret'),
          expiresIn,
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          secret: this.configService.get('jwt.refresh-token-secret'),
          expiresIn: rExpiresIn,
        },
      ),
    ]);
    const eToSecond = Math.floor(
      (new Date().getTime() + +ms(expiresIn)) / 1000,
    );
    const rEToSecond = Math.floor(
      (new Date().getTime() + +ms(rExpiresIn)) / 1000,
    );
    // 白名单机制 签发新token之前的都失效 参考：https://segmentfault.com/q/1010000044878661
    // value为到期时间可能存在相同时间，但对于该项目足够使用，可以考虑存入token
    await this.redisServer.set(
      jwtWrapper(userId),
      eToSecond,
      Math.floor(+ms(expiresIn) / 1000),
    );
    await this.redisServer.set(
      jwtRefreshWrapper(userId),
      rEToSecond,
      Math.floor(+ms(rExpiresIn) / 1000),
    );

    return {
      accessToken,
      refreshToken,
      expiresIn: eToSecond, // 秒
    };
  }

  public async refreshToken(refreshToken: string, test = false) {
    try {
      const { userId, exp } = await this.jwtService.verifyAsync<{
        userId: number;
        exp: number;
      }>(refreshToken, {
        secret: this.configService.get('jwt.refresh-token-secret'),
      });
      let user: { id: number; username: string };
      // 测试环境模拟用户不需要查询数据库
      if (!test) {
        user = await this.prismaService.user.findUniqueOrThrow({
          where: { id: userId },
          select: { id: true, username: true },
        });
      } else {
        user = testByUser;
      }
      const cacheExp = await this.redisServer.get(jwtRefreshWrapper(userId));
      if (+cacheExp == exp) {
        return await this.getTokens(user.id, user.username);
      }
      throw new Error('refreshToken无效');
    } catch (error) {
      if (noop) {
        this.logger.error(error, AuthService.name);
      }
      throw new BadRequestException('refreshToken无效');
    }
  }
}

type UpdateConfig = {
  data: Pick<User, 'email' | 'password'>;
  captcha: string;
};
