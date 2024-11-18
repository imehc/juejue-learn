import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { registerWrapper } from 'src/config/helper';
import { EmailDto } from './dto/email.dto';
import { LoginUserDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Get('register-captcha')
  async registerCaptcha(@Query() { email }: EmailDto) {
    const hasCaptcha = await this.redisService.get(registerWrapper(email));
    if (hasCaptcha) {
      throw new HttpException('请勿重复发送', HttpStatus.BAD_REQUEST);
    }

    const ttl = 5 * 60; // 五分钟有效期
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(registerWrapper(email), code, ttl);
    await this.emailService.sendMail({
      to: email,
      subject: this.emailService.getCaptchaType('register'),
      text: code,
      type: 'register',
      ttl: ttl / 60,
    });
    return '发送成功';
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    const user =  await this.userService.register(registerUser);
    return this.sign({ id: user.id, username: user.username });
  }

  @Post('login')
  async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);
    return this.sign({ id: user.id, username: user.username });
  }

  private async sign({ id, username }: Pick<User, 'id' | 'username'>) {
    // TODO: 双刷token
    const accessToken = this.jwtService.sign(
      { userId: id, username },
      // { expiresIn: '' }, 
    );
    return {
      accessToken,
    };
  }
}
