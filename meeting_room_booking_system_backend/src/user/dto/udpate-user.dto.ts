import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiPropertyOptional()
  headPic?: string;

  @ApiPropertyOptional()
  nickName?: string;

  @IsNotEmpty({
    message: '验证码不能为空',
  })
  @ApiProperty()
  captcha: number;
}
