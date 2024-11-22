import { IsNotEmpty } from 'class-validator';
import { EmailDto } from './email.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserEmailDto extends EmailDto {
  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
