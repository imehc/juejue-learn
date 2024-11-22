import { ApiProperty } from '@nestjs/swagger';
import { ChatroomType } from '@prisma/client';
import { UserInfo as User } from '../../user/vo/info.vo';

export class ChatRoom {
  @ApiProperty({ description: '聊天室id' })
  id: number;

  @ApiProperty({ description: '聊天室名称' })
  name: string;

  @ApiProperty({
    description: '聊天室类型',
    enum: ChatroomType,
    enumName: 'ChatroomType',
  })
  status: ChatroomType;

  @ApiProperty({ description: '创建时间' })
  createdAt: Date;
}

export class ChatRoomUserId {
  @ApiProperty({ description: '聊天室成员id', isArray: true, type: Number })
  userIds: number[];
}

export class ChatRoomUser {
  @ApiProperty({ description: '聊天室成员id', isArray: true, type: User })
  users: User[];
}
