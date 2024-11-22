import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { EmailDto } from './email.dto';

export class RegisterUserDto extends EmailDto {
  @MaxLength(8, { message: '用户名长度不能大于8位' })
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @MaxLength(20, { message: '昵称不能超过20个字符' })
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;

  @IsEmail({}, { message: '邮箱格式不正确' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
