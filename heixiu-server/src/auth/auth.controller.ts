import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Post,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
} from '@nestjs/swagger';
import { EmailDto } from 'src/user/dto/email.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { forgetPasswordWrapper, registerWrapper } from 'src/helper/helper';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { RegisterDto } from './dto/register.dto';
import { Auth } from './vo/auth.vo';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @ApiOperation({
    description: '用户发送注册验证码',
    operationId: 'sendRegisterCaptcha',
    tags: ['auth'],
  })
  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    example: 'xxx@xx.com',
  })
  @ApiOkResponse({ description: '发送成功', type: String })
  @Get('register/captcha')
  public async registerCaptcha(@Query() { email }: EmailDto) {
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

  @ApiOperation({
    description: '用户发送找回密码验证码',
    operationId: 'sendForgotPasswordCaptcha',
    tags: ['auth'],
  })
  @ApiQuery({
    name: 'email',
    type: String,
    description: '邮箱地址',
    example: 'xxx@xx.com',
  })
  @ApiOkResponse({ description: '发送成功', type: String })
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
    await this.emailService.sendMail({
      to: email,
      subject: this.emailService.getCaptchaType('forget-password'),
      text: code,
      type: 'forget-password',
      ttl: ttl / 60,
    });
    return '发送成功';
  }

  @ApiOperation({
    description: '用户找回密码',
    operationId: 'forgetPassword',
    tags: ['auth'],
  })
  @ApiBody({ type: ForgetPasswordDto })
  @ApiOkResponse({ description: '重置密码成功', type: String })
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  public async forgetPassword(@Body() { captcha, ...data }: ForgetPasswordDto) {
    await this.authService.updateUser({
      data: data,
      captcha,
    });
    return '重置密码成功';
  }

  @ApiOperation({
    description: '用户注册',
    operationId: 'register',
    tags: ['auth'],
  })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: Auth })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(@Body() registerUser: RegisterDto) {
    const user = await this.authService.register(registerUser);
    return this.authService.getTokens(user.id, user.username);
  }

  @ApiOperation({
    description: '用户登录',
    operationId: 'login',
    tags: ['auth'],
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: Auth })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() loginUser: LoginDto) {
    const user = await this.authService.login(loginUser);
    return this.authService.getTokens(user.id, user.username);
  }

  @ApiOperation({
    description: '用户登出',
    operationId: 'logout',
    tags: ['auth'],
  })
  @ApiOkResponse({ type: String, description: '退出成功' })
  @HttpCode(HttpStatus.OK)
  @RequireLogin()
  @Get('logout')
  public async logout(@UserInfo('userId') userId: number) {
    await this.authService.logout(userId);
    return '退出成功';
  }

  @ApiOperation({
    description: '使用refreshToken获取新的token',
    operationId: 'refresh',
    tags: ['auth'],
  })
  @ApiQuery({ type: LoginDto })
  @ApiOkResponse({ type: Auth })
  @HttpCode(HttpStatus.OK)
  @RequireLogin()
  @Get('refresh')
  public async refreshToken(@Query() { refreshToken }: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshToken);
  }
}
