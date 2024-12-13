import { ApiProperty } from '@nestjs/swagger';

export class PresignedUrlVo {
  @ApiProperty({ description: '预签名的put请求地址' })
  presignedPutUrl: string;

  @ApiProperty({ description: '过期时间(秒)' })
  expiresIn: number;
}
