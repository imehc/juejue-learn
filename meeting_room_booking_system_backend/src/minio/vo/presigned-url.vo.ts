import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlVo {
  @ApiProperty()
  presignedPutUrl: string;
}
