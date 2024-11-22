import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChatroomMemberInfoDto {
  @IsNotEmpty({
    message: '聊天室id不能为空',
  })
  @IsNumber({}, { message: '聊天室id必须是数字' })
  @Transform((params) => Number(params.value))
  id: number;
}
