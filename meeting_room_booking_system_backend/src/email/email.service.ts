import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';
import { ConfigurationImpl } from 'src/config/configuration-impl';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(private configService: ConfigService<ConfigurationImpl>) {
    this.transporter = createTransport({
      host: this.configService.get('nodemailer-server.host'),
      port: this.configService.get('nodemailer-server.port'),
      secure: false,
      auth: {
        user: this.configService.get('nodemailer-server.user'),
        pass: this.configService.get('nodemailer-server.pass'),
      },
    });
  }

  async sendMail({
    to,
    subject,
    html,
  }: Pick<SendMailOptions, 'to' | 'subject' | 'html'>) {
    await this.transporter.sendMail({
      from: {
        name: '会议室预定系统',
        address: this.configService.get('nodemailer-server.user'),
      },
      to,
      subject,
      html,
    });
  }
}
