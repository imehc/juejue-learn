import {
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RedisService } from 'src/redis/redis.service';
import { RegisterUserDto } from './dto/register.dto';
import { registerWrapper } from 'src/config/helper';
import { CREATED } from 'src/config/const';

@Injectable()
export class UserService {
  @Inject(PrismaService)
  private prismaService: PrismaService;

  @Inject(RedisService)
  private redisServer: RedisService;

  private logger = new Logger();

  async register({ captcha, ...data }: RegisterUserDto) {
    const cacheCaptcha = await this.redisServer.get(
      registerWrapper(data.email),
    );
    if (!cacheCaptcha) {
      throw new HttpException('验证码失效', HttpStatus.BAD_REQUEST);
    }
    if (captcha !== cacheCaptcha) {
      throw new HttpException('验证码错误', HttpStatus.BAD_REQUEST);
    }

    const foundUser = await this.prismaService.user.findUnique({
      where: { email: data.email },
    });
    if (foundUser) {
      throw new HttpException('该邮箱已存在', HttpStatus.BAD_REQUEST);
    }

    try {
      await this.prismaService.user.create({
        data,
        select: {
          id: true,
          /** 只返回选择的字段 */
        },
      });
      return CREATED;
    } catch (error) {
      this.logger.error(error, UserService);
      throw new HttpException('内部错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
