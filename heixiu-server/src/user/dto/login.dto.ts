import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto  {
  @IsNotEmpty({ message: '用户名不能为空' })
  @MaxLength(16, { message: '用户名长度不能大于8位' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  password: string;
}
