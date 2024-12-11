import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { updateEmailWrapper } from 'src/helper/helper';
import { md5 } from 'src/helper/utils';
import { User } from '@prisma/client';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private readonly prismaService: PrismaService;

  @Inject(RedisService)
  private readonly redisServer: RedisService;

  private readonly logger = new Logger();

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

export type UpdateConfig =
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
