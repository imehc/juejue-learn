import { Controller } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @OnEvent('send-email')
  public async sendEmail(payload: Parameters<typeof this.emailService.sendMail>[number]) {
    return await this.emailService.sendMail(payload);
  }
}
