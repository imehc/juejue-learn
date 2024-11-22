import { Transform } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChatroomQueryDto {
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
