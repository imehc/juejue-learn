import { Controller, Get, SetMetadata } from '@nestjs/common';
import { AppService } from './app.service';
import { RequireLogin, UserInfo } from './config/custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('aaa')
  @RequireLogin()
  aaaa(@UserInfo() user): string {
    console.log(user);
    return 'aaa';
  }

  @Get('bbb')
  bbbb(): string {
    return 'bbb';
  }
}
