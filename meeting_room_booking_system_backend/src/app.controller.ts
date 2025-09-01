import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {
  RequireLogin,
  RequirePermission,
  UserInfo,
} from './helper/custom.decorator';
import { JwtUserData } from './helper';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiExcludeEndpoint() // 不生成swagger文档
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiExcludeEndpoint()
  @Get('aaa')
  // @SetMetadata(LOGIN_METADATA, true)
  // @SetMetadata(PERMISSION_METADATA, ['ddd'])
  // 封装为
  @RequireLogin()
  @RequirePermission('ddd')
  aaaa(
    @UserInfo('username') username: string,
    @UserInfo() userInfo: JwtUserData,
  ) {
    console.log(username);
    console.log(userInfo);
    return 'aaa';
  }

  @ApiExcludeEndpoint()
  @Get('bbb')
  bbb() {
    return 'bbb';
  }
}
