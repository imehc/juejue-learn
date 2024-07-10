import { ApiPropertyOptional, PickType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class UpdateUserDto extends PickType(RegisterUserDto, ['captcha']) {
  @ApiPropertyOptional()
  headPic?: string;

  @ApiPropertyOptional()
  nickName: string;
}
