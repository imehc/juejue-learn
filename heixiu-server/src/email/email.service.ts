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
import { CaptchaType, getCaptchaType } from 'src/helper/email';

@Injectable()
export class EmailService {
  private readonly transporter: Transporter;

  private readonly logger = new Logger(EmailService.name);

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
      return await this.transporter.sendMail({
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
      this.logger.error(error);
      return error;
    }
  }

  private loadTemplate(type: CaptchaType, code: string, ttl: number) {
    const __dirname = resolve();
    const filePath = join(__dirname, '/templates/captcha.html');
    const source = readFileSync(filePath, 'utf-8').toString();
    const template = compile(source);
    const replacements = {
      type: getCaptchaType(type),
      code,
      validity: ttl, // 分钟
    };
    return template(replacements);
  }
}
