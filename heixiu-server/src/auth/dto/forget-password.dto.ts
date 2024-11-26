import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { EmailDto } from '../../user/dto/email.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ForgetPasswordDto extends EmailDto {
  @ApiProperty({ description: '密码' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '验证码' })
  @IsNotEmpty({ message: '验证码不能为空' })
  captcha: string;
}
