import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { EmailDto } from './email.dto';

export class ForgetPasswordUserDto extends EmailDto {
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
