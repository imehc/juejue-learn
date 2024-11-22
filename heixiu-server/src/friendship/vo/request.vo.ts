import { ApiProperty } from '@nestjs/swagger';
import { FriendRequestStatus } from '@prisma/client';

export class FriendApplication {
  @ApiProperty({ description: '好友申请id' })
  id: number;

  @ApiProperty({ description: '申请人id' })
  fromUserId: number;

  @ApiProperty({ description: '申请理由', required: false })
  reason: string;

  @ApiProperty({
    description: '申请状态',
    enum: FriendRequestStatus,
    enumName: 'FriendApplicationStatus',
  })
  status: FriendRequestStatus;

  @ApiProperty({ description: '申请时间' })
  createdAt: Date;

  @ApiProperty({ description: '更新时间' })
  updateAt: Date;
}
