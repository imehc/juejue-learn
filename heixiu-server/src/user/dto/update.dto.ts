import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: '昵称' })
  @MaxLength(20, { message: '昵称不能超过20个字符' })
  @IsNotEmpty({ message: '昵称不能为空' })
  nickname: string;

  @ApiProperty({ description: '头像', required: false })
  headPic: string;
}
