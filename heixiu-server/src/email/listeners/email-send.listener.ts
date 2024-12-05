import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from '../email.service';

/** 避免多次实例化 */
@Injectable()
export class EmailSendListener {
  constructor(private readonly emailService: EmailService) {}

  @OnEvent('send-email')
  sendEmail(payload: Parameters<typeof this.emailService.sendMail>[number]) {
    return this.emailService.sendMail(payload);
  }
}
