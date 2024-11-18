import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import { compile } from 'handlebars';
import type Mail from 'nodemailer/lib/mailer';
import { ConfigurationImpl } from 'src/config/configuration';
import { join, resolve } from 'path';
import { readFileSync } from 'fs';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  private logger = new Logger();

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

  async sendMail({
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
      validity: ttl,
    };
    return template(replacements);
  }

  public getCaptchaType(type: CaptchaType) {
    switch (type) {
      case 'register':
        return '感谢您注册Heixiu聊天室！';
      case 'login':
        return '您正在登录Heixiu聊天室！';
      default:
        return '感谢您的使用！';
    }
  }
}

type CaptchaType = 'register' | 'login';
