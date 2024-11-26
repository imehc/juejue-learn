import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  @ApiProperty({ description: 'accessToken' })
  accessToken: string;
  @ApiProperty({ description: 'refreshToken' })
  refreshToken: string;
  @ApiProperty({ description: '过期时间' })
  expiresIn: number;
}
