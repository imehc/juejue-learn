import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
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
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import {
  REGISTER_CAPTCHA,
  UPDATE_PASSWORD_CAPTCHA,
  UPDATE_USER_CAPTCHA,
} from 'src/helper/consts';
import { UpdateUserDto } from './dto/udpate-user.dto';

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

  /** 获取注册验证码 */
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    await this.handleSendCode(REGISTER_CAPTCHA(address), address, {
      ttl: 5,
      title: '注册验证码',
      type: '注册',
    });
    return '发送成功';
  }

  /** 获取更改密码验证码 */
  @Get('update_password/captcha')
  async updatePasswordCaptcha(@Query('address') address: string) {
    await this.handleSendCode(UPDATE_PASSWORD_CAPTCHA(address), address, {
      title: '更改密码验证码',
      type: '更改密码',
    });

    return '发送成功';
  }

  /** 获取更新用户信息验证码 */
  @Get('update/captcha')
  async updateCaptcha(@Query('address') address: string) {
    await this.handleSendCode(UPDATE_USER_CAPTCHA(address), address, {
      title: '更改用户信息验证码',
      type: '更改用户信息验证码',
    });

    return '发送成功';
  }

  /** 注册用户 */
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  /** 普通用户登录 */
  @Post('login')
  @HttpCode(HttpStatus.OK)
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

  /** 管理员登录 */
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
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

  /** 普通用户使用refreshToken换取新token */
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

  /** 管理员使用refreshToken换取新token */
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

  /** 获取用户/管理员信息 */
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }

  /** 更新密码 */
  @Post(['update_password', 'admin/update_password'])
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, passwordDto);
  }

  /** 更新用户信息 */
  @Post(['update', 'admin/update'])
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
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

  private async handleSendCode(
    key: string,
    address: string,
    { ttl = 10, title, type }: { ttl?: number; title?: string; type?: string },
  ) {
    const code = Math.random().toString().slice(2, 8);

    await this.redisService.set(key, code, ttl * 60);

    await this.emailService.sendMail({
      to: address,
      subject: title,
      html: `<p>你的${type}验证码是 ${code},${ttl}分钟内有效</p>`,
    });
  }

  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
}
