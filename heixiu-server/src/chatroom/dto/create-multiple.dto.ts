import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateMultipleChatroomDto {
  @MaxLength(50, { message: '不能超过50个字符' })
  @IsNotEmpty({
    message: '请选择群聊名称',
  })
  name: string;
}
