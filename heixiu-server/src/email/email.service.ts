import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { compile } from 'handlebars';
import type Mail from 'nodemailer/lib/mailer';
import { ConfigurationImpl } from 'src/helper/configuration';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';
import { RedisService } from 'src/redis/redis.service';
import { forgetPasswordWrapper, registerWrapper } from 'src/helper/helper';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  private readonly logger = new Logger();

  @Inject(RedisService)
  private readonly redisService: RedisService;

  constructor(private configService: ConfigService<ConfigurationImpl>) {
    this.transporter = createTransport({
      host: configService.get('nodemailer-server.host'),
      port: configService.get('nodemailer-server.port'),
      auth: {
        user: configService.get('nodemailer-server.user'),
        pass: configService.get('nodemailer-server.pass'),
      },
    });
  }

  public async sendMail({
    to,
    subject,
    text,
    type,
    ttl,
  }: Pick<Mail.Options, 'to' | 'subject' | 'text'> & {
    type: CaptchaType;
    ttl: number;
  }) {
    try {
      await this.transporter.sendMail({
        from: {
          name: 'Heixiu聊天室',
          address: this.configService.get('nodemailer-server.user'),
        },
        to,
        subject,
        html: this.loadTemplate(type, text as string, ttl),
      });
    } catch (error) {
      // 发送失败删除缓存验证码
      switch (type) {
        case 'register':
          await this.redisService.del(registerWrapper(to as string));
          break;
        case 'forget-password':
          await this.redisService.del(forgetPasswordWrapper(to as string));
        default:
          break;
      }
      this.logger.error(error, EmailService);
      throw new HttpException('请检查该邮箱是否存在', HttpStatus.BAD_REQUEST);
    }
  }

  private loadTemplate(type: CaptchaType, code: string, ttl: number) {
    const __dirname = resolve();
    const filePath = join(__dirname, '/templates/captcha.html');
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = compile(source);
    const replacements = {
      type: this.getCaptchaType(type),
      code,
      validity: ttl, // 分钟
    };
    return template(replacements);
  }

  public getCaptchaType(type: CaptchaType) {
    switch (type) {
      case 'register':
        return '感谢您注册Heixiu聊天室！';
      case 'forget-password':
        return '您正在重置密码！';
      case 'login':
        return '您正在登录Heixiu聊天室！';
      default:
        return '感谢您的使用！';
    }
  }
}

type CaptchaType = 'register' | 'login' | 'forget-password';
