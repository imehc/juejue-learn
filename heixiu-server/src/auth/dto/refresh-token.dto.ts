import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'refreshToken' })
  @IsNotEmpty({ message: 'refreshToken不能为空' })
  refreshToken: string;
}
