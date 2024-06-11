import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from './helper/custom.decorator';
import { JwtUserData } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('aaa')
  // @SetMetadata(LOGIN_METADATA, true)
  // @SetMetadata(PERMISSION_METADATA, ['ddd'])
  // 封装为
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa(
    @UserInfo('username') username: string,
    @UserInfo('') userInfo: JwtUserData,
  ) {
    console.log(username);
    console.log(userInfo);
    return 'aaa';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
