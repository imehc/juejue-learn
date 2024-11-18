import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdatePasswordUserDto {
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  oldPassword: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能小于6位' })
  @MaxLength(16, { message: '密码长度不能大于16位' })
  password: string;
}
