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
import { forgetPasswordWrapper, registerWrapper } from 'src/config/helper';
import { EmailDto } from './dto/email.dto';
import { LoginUserDto } from './dto/login.dto';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { RequireLogin, UserInfo } from 'src/config/custom.decorator';
import { UpdatePasswordUserDto } from './dto/update-password.dto';
import { ForgetPasswordUserDto } from './dto/forget-password.dto';
import { UpdateUserDto } from './dto/update.dto';
import { UpdateUserEmailDto } from './dto/update-email.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Inject(EmailService)
  private readonly emailService: EmailService;

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(JwtService)
  private readonly jwtService: JwtService;

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

  @Post('forget-password')
  public async forgetPassword(
    @Body() { captcha, ...data }: ForgetPasswordUserDto,
  ) {
    await this.userService.updateUser({
      type: 'forget-password',
      data: data,
      captcha,
    });
    return '重置密码成功';
  }

  @Post('register')
  public async register(@Body() registerUser: RegisterUserDto) {
    const user = await this.userService.register(registerUser);
    return this.sign({ id: user.id, username: user.username });
  }

  @Post('login')
  public async login(@Body() loginUser: LoginUserDto) {
    const user = await this.userService.login(loginUser);
    return this.sign({ id: user.id, username: user.username });
  }

  @Get('info')
  @RequireLogin()
  public async info(@UserInfo('userId') userId: number) {
    return this.userService.findUserById(userId);
  }

  @Post('update-password')
  @RequireLogin()
  public async updatePassword(
    @UserInfo('userId') userId: number,
    @Body() updatePasswordUserDto: UpdatePasswordUserDto,
  ) {
    await this.userService.updateUser({
      type: 'update-password',
      data: { id: userId, ...updatePasswordUserDto },
    });
    return '修改密码成功';
  }

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

  @Post('update-email')
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
