import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class ChatroomQueryDto {
  @ApiProperty({
    description: '加入的成员id',
    required: false,
  })
  @Transform((params) => {
    try {
      if (!Number.isNaN(Number(params.value))) {
        return Number(params.value);
      }
      return undefined;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  })
  joinUserId: number;
}
