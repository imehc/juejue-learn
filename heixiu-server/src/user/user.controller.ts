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
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from 'src/email/email.service';
import { RedisService } from 'src/redis/redis.service';
import { forgetPasswordWrapper, registerWrapper } from 'src/helper/helper';
import { EmailDto } from './dto/email.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from 'src/helper/custom.decorator';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { ForgetPasswordDto } from './dto/forget-password.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UpdateUserEmailDto } from './dto/update-email.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiExtraModels,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { Auth } from './vo/auth.vo';
import { CreateAt, UserInfo as User } from './vo/info.vo';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

  @ApiOperation({
    description: '用户发送注册验证码',
    operationId: 'sendRegisterCaptcha',
    tags: ['user'],
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
    tags: ['user'],
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
    tags: ['user'],
  })
  @ApiBody({ type: ForgetPasswordDto })
  @ApiOkResponse({ description: '重置密码成功', type: String })
  @HttpCode(HttpStatus.OK)
  @Post('forget-password')
  public async forgetPassword(@Body() { captcha, ...data }: ForgetPasswordDto) {
    await this.userService.updateUser({
      type: 'forget-password',
      data: data,
      captcha,
    });
    return '重置密码成功';
  }

  @ApiOperation({
    description: '用户注册',
    operationId: 'register',
    tags: ['user'],
  })
  @ApiBody({ type: RegisterDto })
  @ApiOkResponse({ type: Auth })
  @HttpCode(HttpStatus.OK)
  @Post('register')
  public async register(@Body() registerUser: RegisterDto) {
    const user = await this.userService.register(registerUser);
    return this.sign({ id: user.id, username: user.username });
  }

  @ApiOperation({
    description: '用户登录',
    operationId: 'login',
    tags: ['user'],
  })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ type: Auth })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  public async login(@Body() loginUser: LoginDto) {
    const user = await this.userService.login(loginUser);
    return this.sign({ id: user.id, username: user.username });
  }

  @ApiOperation({
    description: '用户获取个人信息',
    operationId: 'findInfo',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiExtraModels(CreateAt)
  @ApiOkResponse({
    content: {
      'application/json': {
        schema: {
          allOf: [
            { $ref: getSchemaPath(User) },
            { $ref: getSchemaPath(CreateAt) },
          ],
        },
      },
    },
  })
  @Get('info')
  @RequireLogin()
  public async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  @ApiOperation({
    description: '用户修改密码',
    operationId: 'updatePassword',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdatePasswordDto })
  @ApiOkResponse({ description: '修改密码成功', type: String })
  @Post('update-password')
  @HttpCode(HttpStatus.OK)
  @RequireLogin()
  public async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() updatePasswordUserDto: UpdatePasswordDto,
  ) {
    await this.userService.updateUser({
      type: 'update-password',
      data: { id: userId, ...updatePasswordUserDto },
    });
    return '修改密码成功';
  }

  @ApiOperation({
    description: '用户更新信息',
    operationId: 'updateInfo',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserDto })
  @ApiOkResponse({ description: '修改成功', type: String })
  @HttpCode(HttpStatus.OK)

  @Post('update')
  @RequireLogin()
  public async update(
    @UserInfo('userId') userId: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    await this.userService.updateUser({
      type: 'update-user',
      data: { id: userId, ...updateUserDto },
    });
    return '修改成功';
  }

  @ApiOperation({
    description: '用户修改邮箱',
    operationId: 'updateEmail',
    tags: ['user'],
  })
  @ApiBearerAuth()
  @ApiBody({ type: UpdateUserEmailDto })
  @ApiOkResponse({ description: '修改成功', type: String })
  @Post('update-email')
  @HttpCode(HttpStatus.OK)

  @RequireLogin()
  public async updateEmail(
    @UserInfo('userId') userId: number,
    @Body() { email, captcha }: UpdateUserEmailDto,
  ) {
    await this.userService.updateUser({
      type: 'update-email',
      data: { id: userId, email },
      captcha,
    });
    return '修改邮箱成功';
  }

  /** 签发jwt */
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
