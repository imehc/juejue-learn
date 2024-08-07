import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({ message: '用户名不能为空' })
  @MaxLength(8, { message: '用户名最多 8 位' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码最少 6 位' })
  @MaxLength(16, { message: '密码最多 16 位' })
  password: string;
}
