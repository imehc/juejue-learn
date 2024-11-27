import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RejectFriendDto {
  @ApiProperty({ description: '用户id' })
  @IsNotEmpty({
    message: '请选择要添加的好友',
  })
  id: number;
}
