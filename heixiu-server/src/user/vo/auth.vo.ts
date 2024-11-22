import { ApiProperty } from '@nestjs/swagger';

export class Auth {
  @ApiProperty({ description: 'accessToken' })
  accessToken: string;
}
