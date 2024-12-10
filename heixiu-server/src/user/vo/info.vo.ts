import { ApiProperty } from '@nestjs/swagger';

export class UserInfo {
  @ApiProperty({ description: '用户id' })
  id: number;

  @ApiProperty({ description: '用户名' })
  username: string;

  @ApiProperty({ description: '邮箱' })
  email: string;

  @ApiProperty({ description: '昵称' })
  nickname: string;

  @ApiProperty({ description: '头像', required: false })
  headPic: string;
}

export class CreateAt {
  @ApiProperty({ description: '创建时间' })
  createAt: Date;
}

export class UpdateAt {
  @ApiProperty({ description: '更新时间' })
  updateAt: Date;
}
