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
import { AuthService } from './auth.service';
import { EmailDto } from 'src/user/dto/email.dto';
import { RedisService } from 'src/redis/redis.service';
import { forgetPasswordWrapper, registerWrapper } from 'src/helper/helper';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { RegisterDto } from './dto/register.dto';
import { Auth } from './vo/auth.vo';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { UserInfo } from 'src/helper/custom.decorator';
import { ApiDoc } from 'src/helper/custom.decorator';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { getCaptchaType } from 'src/helper/email';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Inject(EventEmitter2)
  private eventEmitter: EventEmitter2;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @ApiDoc({
    operation: {
      description: '用户发送注册验证码',
      operationId: 'sendRegisterCaptcha',
      tags: ['auth'],
    },
    response: { type: String, description: '发送成功' },
    noBearerAuth: true,
  })
  @Get('register/captcha')
  public async registerCaptcha(@Query() { email }: EmailDto) {
    const hasCaptcha = await this.redisService.get(registerWrapper(email));
    if (hasCaptcha) {
      throw new HttpException('请勿重复发送', HttpStatus.BAD_REQUEST);
    }

    const ttl = 5 * 60; // 五分钟有效期
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(registerWrapper(email), code, ttl);
    await this.eventEmitter.emitAsync('send-email', {
      to: email,
      subject: getCaptchaType('register'),
      text: code,
      type: 'register',
      ttl: ttl / 60,
    });
    return '发送成功';
  }

  @ApiDoc({
    operation: {
      description: '用户发送找回密码验证码',
      operationId: 'sendForgotPasswordCaptcha',
      tags: ['auth'],
    },
    response: { type: String, description: '发送成功' },
    noBearerAuth: true,
  })
  @Get('forget-password/captcha')
  public async forgetPasswordCaptcha(@Query() { email }: EmailDto) {
    const hasCaptcha = await this.redisService.get(
      forgetPasswordWrapper(email),
    );
    if (hasCaptcha) {
      throw new HttpException('请勿重复发送', HttpStatus.BAD_REQUEST);
    }

    const ttl = 5 * 60; // 五分钟有效期
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(forgetPasswordWrapper(email), code, ttl);
    await this.eventEmitter.emitAsync('send-email',{
      to: email,
      subject: getCaptchaType('forget-password'),
      text: code,
      type: 'forget-password',
      ttl: ttl / 60,
    });
    return '发送成功';
  }

  @ApiDoc({
    operation: {
      description: '用户找回密码',
      operationId: 'forgetPassword',
      tags: ['auth'],
    },
    response: { type: String, description: '重置密码成功' },
    noBearerAuth: true,
  })
  @Post('forget-password')
  public async forgetPassword(@Body() { captcha, ...data }: ForgetPasswordDto) {
    await this.authService.updateUser({
      data: data,
      captcha,
    });
    return '重置密码成功';
  }

  @ApiDoc({
    operation: {
      summary: '用户注册',
      operationId: 'register',
      tags: ['auth'],
    },
    response: { type: Auth },
    noBearerAuth: true,
  })
  @Post('register')
  public async register(@Body() registerUser: RegisterDto) {
    const user = await this.authService.register(registerUser);
    return this.authService.getTokens(user.id, user.username);
  }

  @ApiDoc({
    operation: {
      summary: '用户登录',
      operationId: 'login',
      tags: ['auth'],
    },
    response: { type: Auth },
    noBearerAuth: true,
  })
  @Post('login')
  public async login(@Body() loginUser: LoginDto) {
    const user = await this.authService.login(loginUser);
    return this.authService.getTokens(user.id, user.username);
  }

  @ApiDoc({
    operation: {
      description: '用户登出',
      operationId: 'logout',
      tags: ['auth'],
    },
    response: { type: String, description: '退出成功' },
  })
  @Get('logout')
  public async logout(@UserInfo('userId') userId: number) {
    await this.authService.logout(userId);
    return '退出成功';
  }

  @ApiDoc({
    operation: {
      summary: '使用refreshToken获取新的token',
      operationId: 'refresh',
      tags: ['auth'],
    },
    response: { type: Auth },
  })
  @Get('refresh')
  public async refreshToken(@Query() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }
}
