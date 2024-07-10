import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class LoginUserDto {
  @MinLength(2)
  @MaxLength(16)
  @ApiProperty() // api文档查看具体的字段信息
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @ApiProperty()
  @IsNotEmpty({
    message: '密码不能为空',
  })
  @MinLength(6, {
    message: '密码不能少于 6 位',
  })
  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}
