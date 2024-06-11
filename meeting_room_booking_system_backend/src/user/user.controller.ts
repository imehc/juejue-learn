import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { LoginUserDto } from './dto/login-user.dto';
import ms from 'ms';
import { LoginUserVo } from './vo/login-user.vo';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private emailService: EmailService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const code = Math.random().toString().slice(2, 8);
    await this.redisService.set(`captcha_${address}`, code, 5 * 60);
    await this.emailService.sendMail({
      to: address,
      subject: '注册验证码',
      html: `<p>你的注册验证码是 ${code}</p>`,
    });
    return '发送成功';
  }

  @Post('register')
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @Post('login')
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.auth = this.handleJwt({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    });
    return vo;
  }

  @Post('admin/login')
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.auth = this.handleJwt({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    });
    return vo;
  }

  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      return this.handleJwt({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      });
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      return this.handleJwt({
        userId: user.id,
        username: user.username,
        roles: user.roles,
        permissions: user.permissions,
      });
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  private handleJwt({
    userId,
    username,
    roles,
    permissions,
  }: {
    userId: number;
    username: string;
    roles: string[];
    permissions: string[];
  }): LoginUserVo['auth'] {
    // TODO: 使用refreshToken获取新的token时 不能通过accessToken重新获取新的token
    const expiresIn: string =
      this.configService.get('jwt_access_token_expires_time') || '30m';
    const accessToken = this.jwtService.sign(
      {
        userId,
        username,
        roles,
        permissions,
      },
      { expiresIn: expiresIn },
    );
    const refeshExpiresIn: string =
      this.configService.get('jwt_refresh_token_expres_time') || '7d';
    const refreshToken = this.jwtService.sign(
      { userId },
      { expiresIn: refeshExpiresIn },
    );

    return {
      accessToken,
      expiresIn: ms(expiresIn),
      refreshToken,
    };
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
}
