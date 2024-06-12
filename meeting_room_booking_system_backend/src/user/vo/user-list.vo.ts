import { ApiProperty } from '@nestjs/swagger';

class User {
  @ApiProperty()
  id: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  nickName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  headPic: string;

  @ApiProperty()
  createAt: Date;
}

export class UserListVo {
  @ApiProperty({
    type: [User],
  })
  users: User[];

  @ApiProperty()
  totalCount: number;
}
