import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { EmailSendListener } from './listeners/email-send.listener';

@Module({
  controllers: [EmailController],
  providers: [EmailService, EmailSendListener],
})
export class EmailModule {}
