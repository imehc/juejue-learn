import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto  {
  @MaxLength(8, { message: '用户名长度不能大于8位' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
