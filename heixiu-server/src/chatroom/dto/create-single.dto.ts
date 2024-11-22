import { IsNotEmpty } from 'class-validator';

export class CreateSingleChatroomDto {
  @IsNotEmpty({
    message: '请选择要添加的好友',
  })
  friendId: number;
}