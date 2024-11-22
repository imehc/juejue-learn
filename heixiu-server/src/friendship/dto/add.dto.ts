import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MaxLength } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({ description: '用户id' })
  @IsNotEmpty({
    message: '请选择要添加的好友',
  })
  friendId: number;

  @ApiProperty({ description: '申请理由', required: false })
  @MaxLength(100, {
    message: '申请理由不能超过100个字符',
  })
  reason: string;
}
