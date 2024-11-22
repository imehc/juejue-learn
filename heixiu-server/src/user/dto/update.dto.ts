import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @MaxLength(20, { message: '昵称不能超过20个字符' })
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;

  headPic: string;
}
