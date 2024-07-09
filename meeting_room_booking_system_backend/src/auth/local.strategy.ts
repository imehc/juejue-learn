import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject(UserService)
  private readonly userService: UserService;

  async validate(username: string, password: string) {
    const dto = new LoginUserDto();
    dto.username = username;
    dto.password = password;

    const user = await this.userService.login(dto, false);
    return user;
    // 会把返回的 user 信息放在 request.user 上
  }
}
