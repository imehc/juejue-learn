import { IsNotEmpty } from 'class-validator';
import { EmailDto } from './email.dto';

export class UpdateUserEmailDto extends EmailDto {
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
