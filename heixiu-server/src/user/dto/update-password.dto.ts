import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordUserDto {
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  @IsNotEmpty({ message: '密码不能为空' })
  oldPassword: string;

  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
