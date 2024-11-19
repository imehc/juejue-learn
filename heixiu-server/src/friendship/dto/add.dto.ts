import { IsNotEmpty, MaxLength } from 'class-validator';

export class FriendAddDto {
  @IsNotEmpty({
    message: '请选择要添加的好友',
  })
  friendId: number;
  
  @MaxLength(100, {
    message: '申请理由不能超过100个字符',
  })
  reason: string;
}
