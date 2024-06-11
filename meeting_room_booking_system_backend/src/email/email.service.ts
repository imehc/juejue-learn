import { Injectable } from '@nestjs/common';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
        user: 'xxxxxxxxxx@outlook.com',
        pass: 'xxxxxxxxxx',
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
        address: 'xxxxxxxxxx@outlook.com',
      },
      to,
      subject,
      html,
    });
  }
}
