import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserDetailVo {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiPropertyOptional()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiPropertyOptional()
  headPic: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  createAt: Date;

  @ApiPropertyOptional()
  isAdmin?: boolean;

  /** openapi generate oneOf
   * @link https://stackoverflow.com/questions/71439982/how-can-i-display-multiple-responsedtos-schemas-in-swagger-nestjs
   */
  type: 'normal';
}
