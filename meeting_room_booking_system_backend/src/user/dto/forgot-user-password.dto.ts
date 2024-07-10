import { OmitType } from '@nestjs/swagger';
import { RegisterUserDto } from './register-user.dto';

export class ForgotUserPasswordDto extends OmitType(RegisterUserDto, [
  'nickName',
]) {}
