import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: '昵称不能为空' })
  @MaxLength(20, { message: '昵称不能超过20个字符' })
  nickname: string;

  headPic: string;
}
