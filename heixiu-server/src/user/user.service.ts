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
import { LoginUserDto } from './dto/login.dto';
import { md5 } from 'src/config/utils';

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

    const checkUserName = await this.prismaService.user.findFirst({
      where: { username: data.username },
    });

    if (checkUserName) {
      throw new HttpException('用户名不能重复', HttpStatus.BAD_REQUEST);
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
      throw new HttpException('内部错误', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const foundUser = await this.prismaService.user.findFirst({
      where: {
        username: loginUserDto.username,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
    });

    if (!foundUser) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST);
    }

    const { password, ...user } = foundUser;
    if (password !== md5(loginUserDto.password)) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST);
    }

    return user;
  }
}
