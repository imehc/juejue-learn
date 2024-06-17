import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
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
import { Auth, LoginUserVo } from './vo/login-user.vo';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import {
  FORGOT_PASSWORD_CAPTCHA,
  REGISTER_CAPTCHA,
  UPDATE_PASSWORD_CAPTCHA,
  UPDATE_USER_CAPTCHA,
} from 'src/helper/consts';
import { UpdateUserDto } from './dto/udpate-user.dto';
import { generateParseIntPipe } from 'src/helper/utils';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UserDetailVo } from './vo/user-info.vo';
import { UserListVo } from './vo/user-list.vo';
import { ForgotUserPasswordDto } from './dto/forgot-user-password.dto';

// @ApiTags('用户管理模块') // 注意：使用这个会导致使用openAPI generate失败
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

  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @ApiOperation({
    summary: '获取注册验证码',
    operationId: 'register-captcha',
    tags: ['captcha'],
  })
  @Get('register-captcha')
  async captcha(@Query('address') address: string) {
    const isExist = await this.userService.checkEmailIsExist(address);
    if (isExist) {
      throw new HttpException(
        '邮箱已存在，换个邮箱试试吧',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.handleSendCode(REGISTER_CAPTCHA(address), address, {
      ttl: 5,
      title: '注册验证码',
      type: '注册',
    });
    return '发送成功';
  }

  @ApiQuery({
    name: 'address',
    type: String,
    description: '邮箱地址',
    example: 'xxx@xx.com',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '发送成功',
    type: String,
  })
  @ApiOperation({
    summary: '获取找回密码验证码',
    operationId: 'fotgot-captcha',
    tags: ['captcha'],
  })
  @Get('forgot-password-captcha')
  async forgotPasswordCaptcha(@Query('address') address: string) {
    await this.handleSendCode(FORGOT_PASSWORD_CAPTCHA(address), address, {
      ttl: 5,
      title: '找回密码验证码',
      type: '找回密码',
    });
    return '发送成功';
  }

  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: '发送成功', type: String })
  @ApiOperation({
    summary: '获取更改密码验证码',
    operationId: 'update-password-captcha',
    tags: ['captcha'],
  })
  @RequireLogin()
  @Get('update-password/captcha')
  async updatePasswordCaptcha(@UserInfo('email') address: string) {
    await this.handleSendCode(UPDATE_PASSWORD_CAPTCHA(address), address, {
      title: '更改密码验证码',
      type: '更改密码',
    });

    return '发送成功';
  }

  // 登录后将邮箱放入token，所以不需要传入邮箱
  @ApiBearerAuth()
  @ApiResponse({ status: HttpStatus.OK, description: '发送成功', type: String })
  @ApiOperation({
    summary: '获取更新用户信息验证码',
    operationId: 'update-user-info-captcha',
    tags: ['captcha', 'user'],
  })
  @RequireLogin()
  @Get('update/captcha')
  async updateCaptcha(@UserInfo('email') address: string) {
    await this.handleSendCode(UPDATE_USER_CAPTCHA(address), address, {
      title: '更改用户信息验证码',
      type: '更改用户信息',
    });

    return '发送成功';
  }

  @ApiBody({ type: RegisterUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/验证码不正确/用户已存在',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '注册成功',
    type: String,
  })
  @ApiOperation({
    summary: '注册用户',
    operationId: 'user-register',
    tags: ['user'],
  })
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(@Body() registerUser: RegisterUserDto) {
    return await this.userService.register(registerUser);
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @ApiOperation({
    summary: '普通用户登录',
    operationId: 'user-login',
    tags: ['user'],
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async userLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, false);
    vo.auth = this.handleJwt({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      email: vo.userInfo.email,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    });
    return vo;
  }

  @ApiBody({ type: LoginUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '用户不存在/密码错误',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户信息和token',
    type: LoginUserVo,
  })
  @ApiOperation({
    summary: '管理员登录',
    operationId: 'system-user-login',
    tags: ['user', 'system-user'],
  })
  @Post('admin/login')
  @HttpCode(HttpStatus.OK)
  async adminLogin(@Body() loginUser: LoginUserDto) {
    const vo = await this.userService.login(loginUser, true);
    vo.auth = this.handleJwt({
      userId: vo.userInfo.id,
      username: vo.userInfo.username,
      email: vo.userInfo.email,
      roles: vo.userInfo.roles,
      permissions: vo.userInfo.permissions,
    });
    return vo;
  }

  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: Auth,
  })
  @ApiOperation({
    summary: '普通用户使用refreshToken换取新token',
    operationId: 'refresh-token',
    tags: ['auth'],
  })
  @Get('refresh')
  async refresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, false);

      return this.handleJwt({
        userId: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      });
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @ApiQuery({
    name: 'refreshToken',
    type: String,
    description: '刷新token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'token 已失效，请重新登录',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '刷新成功',
    type: Auth,
  })
  @ApiOperation({
    summary: '管理员使用refreshToken换取新token',
    operationId: 'refresh-admin-token',
    tags: ['auth', 'system-user'],
  })
  @Get('admin/refresh')
  async adminRefresh(@Query('refreshToken') refreshToken: string) {
    try {
      const data = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId, true);

      return this.handleJwt({
        userId: user.id,
        username: user.username,
        email: user.email,
        roles: user.roles,
        permissions: user.permissions,
      });
    } catch (e) {
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }

  @ApiBearerAuth() // 需要登录标识
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'success',
    type: UserDetailVo,
  })
  @ApiOperation({
    summary: '获取用户/管理员信息',
    operationId: 'get-user-info',
    tags: ['user', 'system-user'],
  })
  @Get('info')
  @RequireLogin()
  async info(@UserInfo('userId') userId: number) {
    return await this.userService.findUserDetailById(userId);
  }

  @ApiBody({ type: ForgotUserPasswordDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '找回密码成功',
    type: String,
  })
  @ApiOperation({
    summary: '用户忘记密码',
    operationId: 'forgot-password',
    tags: ['user'],
  })
  @Post('forgot-password')
  async forgotPassword(@Body() passwordDto: ForgotUserPasswordDto) {
    return await this.userService.forgotPassword(passwordDto);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserPasswordDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户更新密码',
    type: String,
  })
  @ApiOperation({
    summary: '用户更新密码',
    operationId: 'update-password',
    tags: ['user'],
  })
  // @Post(['update-password', 'admin/update-password']) // 由于需要指定唯一operationId，所以需要拆分
  @Post('update-password')
  @RequireLogin()
  async updatePassword(
    @UserInfo('userId') userId: number,
    @UserInfo('email') address: string,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, address, passwordDto);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserPasswordDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码已失效/不正确',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '管理员更新密码成功',
    type: String,
  })
  @ApiOperation({
    summary: '管理员更新密码',
    operationId: 'update-system-password',
    tags: ['user', 'system-user'],
  })
  @Post('admin/update-password')
  @RequireLogin()
  async updateAdminPassword(
    @UserInfo('userId') userId: number,
    @UserInfo('email') address: string,
    @Body() passwordDto: UpdateUserPasswordDto,
  ) {
    return await this.userService.updatePassword(userId, address, passwordDto);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码不正确/已失效',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String,
  })
  @ApiOperation({
    summary: '用户更新用户信息',
    operationId: 'update-user-info',
    tags: ['user'],
  })
  @Post('update')
  @RequireLogin()
  async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '验证码不正确/已失效',
    type: String,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '更新成功',
    type: String,
  })
  @ApiOperation({
    summary: '管理员更新管理员信息',
    operationId: 'update-system-user-info',
    tags: ['user', 'system-user'],
  })
  @Post('admin/update')
  @RequireLogin()
  async updateAdmin(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.update(userId, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: '冻结用户的用户ID', type: Number })
  @ApiResponse({ status: HttpStatus.OK, description: 'success', type: String })
  @ApiOperation({
    summary: '冻结用户',
    operationId: 'freeze-user',
    tags: ['system-user'],
  })
  @Put('freeze/:id')
  @RequireLogin()
  async freeze(
    @Param('id') freezeId: number,
    @UserInfo('userId') userId: number, // 判断当前是否具有权限冻结
  ) {
    await this.userService.freezeUserById(freezeId, userId);
    return 'success';
  }

  @ApiBearerAuth()
  @ApiQuery({ name: 'skip', description: '第几页', type: Number })
  @ApiQuery({ name: 'limit', description: '每页多少条', type: Number })
  @ApiQuery({ name: 'username', description: '用户名', required: false })
  @ApiQuery({ name: 'nickName', description: '昵称', required: false })
  @ApiQuery({ name: 'email', description: '邮箱地址', required: false })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '用户列表',
    type: UserListVo,
  })
  @ApiOperation({
    summary: '用户列表',
    operationId: 'get-user-list',
    tags: ['user'],
  })
  @Get('list')
  async list(
    // 默认值
    @Query('skip', new DefaultValuePipe(1), generateParseIntPipe('skip'))
    skip: number,
    @Query('limit', new DefaultValuePipe(2), generateParseIntPipe('limit'))
    limit: number,
    @Query('username') username: string,
    @Query('nickName') nickName: string,
    @Query('email') email: string,
  ) {
    return await this.userService.findUsers(
      username,
      nickName,
      email,
      limit,
      skip,
    );
  }

  private handleJwt({
    userId,
    username,
    roles,
    permissions,
    email,
  }: {
    userId: number;
    username: string;
    email: string;
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
        email,
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

  @ApiOperation({ deprecated: true })
  @Get('init-data')
  async initData() {
    await this.userService.initData();
    return 'done';
  }
}
