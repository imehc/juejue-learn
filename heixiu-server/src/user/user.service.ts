import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { RegisterDto } from './dto/register.dto';
import {
  forgetPasswordWrapper,
  registerWrapper,
  updateEmailWrapper,
} from 'src/helper/helper';
import { LoginDto } from './dto/login.dto';
import { md5 } from 'src/helper/utils';
import { User } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Injectable()
export class UserService {
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
      this.logger.error(error, UserService);
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

  public async findUserById(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        nickname: true,
        headPic: true,
        createAt: true,
      },
    });
    return user;
  }

  public async updateUser(config: UpdateConfig) {
    switch (config.type) {
      case 'forget-password': {
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
          this.logger.error(error, UserService);
          throw new InternalServerErrorException('服务异常');
        } finally {
          this.redisServer.del(forgetPasswordWrapper(config.data.email));
        }
        break;
      }
      case 'update-password': {
        const foundUser = await this.prismaService.user.findUnique({
          where: { id: config.data.id },
        });
        if (!foundUser) {
          throw new BadRequestException('用户不存在');
        }
        if (md5(config.data.oldPassword) !== foundUser.password) {
          throw new BadRequestException('原密码不正确');
        }
        if (md5(config.data.oldPassword) === md5(config.data.password)) {
          throw new BadRequestException('新密码不能原密码相同');
        }
        try {
          await this.prismaService.user.update({
            where: { id: config.data.id },
            data: { password: md5(config.data.password) },
          });
        } catch (error) {
          this.logger.error(error, UserService);
          throw new InternalServerErrorException('服务异常');
        }
        break;
      }
      case 'update-user': {
        const { nickname, headPic, id } = config.data;
        try {
          await this.prismaService.user.update({
            where: { id },
            data: { nickname, headPic },
          });
        } catch (error) {
          this.logger.error(error, UserService);
          throw new InternalServerErrorException('服务异常');
        }
        break;
      }
      case 'update-email': {
        const foundUser = await this.prismaService.user.findUnique({
          where: { id: config.data.id },
        });
        if (!foundUser) {
          throw new BadRequestException('用户不存在');
        }
        const cacheCaptcha = await this.redisServer.get(
          updateEmailWrapper(config.data.email),
        );
        if (!cacheCaptcha) {
          throw new BadRequestException('验证码失效');
        }
        if (cacheCaptcha !== config.captcha) {
          throw new BadRequestException('验证码错误');
        }
        try {
          await this.prismaService.user.update({
            where: { id: foundUser.id },
            data: { email: config.data.email },
          });
        } catch (error) {
          this.logger.error(error, UserService);
          throw new InternalServerErrorException('服务异常');
        } finally {
          this.redisServer.del(updateEmailWrapper(config.data.email));
        }
      }
    }
  }
}

type UpdateConfig =
  | {
      type: 'forget-password';
      data: Pick<User, 'email' | 'password'>;
      captcha: string;
    }
  | {
      type: 'update-password';
      data: Pick<User, 'id'> & UpdatePasswordDto;
    }
  | {
      type: 'update-email';
      data: Pick<User, 'id' | 'email'>;
      captcha: string;
    }
  | {
      type: 'update-user';
      data: Pick<User, 'id' | 'nickname' | 'headPic'>;
    };
