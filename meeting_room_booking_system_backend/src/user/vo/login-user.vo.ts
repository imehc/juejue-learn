import { ApiProperty } from '@nestjs/swagger';

/** TODO: 确定权限类型 */
export class Permission {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'ccc' })
  code: string;

  @ApiProperty({ example: '访问 ccc 接口' })
  description: string;
}

export class UserInfo {
  @ApiProperty()
  id: number;

  @ApiProperty({ example: 'zhangsan' })
  username: string;

  @ApiProperty({ example: '张三' })
  nickName: string;

  @ApiProperty({ example: 'xx@xx.com' })
  email: string;

  @ApiProperty({ example: 'xxx.png' })
  headPic: string;

  @ApiProperty({ example: '13233333333' })
  phoneNumber: string;

  @ApiProperty()
  isFrozen: boolean;

  @ApiProperty()
  isAdmin: boolean;

  @ApiProperty()
  createAt: Date;

  @ApiProperty({ example: ['管理员'], type: String, isArray: true })
  roles: string[];

  @ApiProperty({ type: Permission, isArray: true })
  permissions: Permission[];

  /** openapi generate oneOf */
  type: 'system';
}

export class Auth {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
  })
  refreshToken: string;

  // tokenType: 'Bearer';

  @ApiProperty({ example: '1800000' })
  expiresIn: number;
}

export class LoginUserVo {
  /** @deprecated 不需要在这儿获取，通过单独的接口获取用户信息 */
  @ApiProperty({ deprecated: true, description: '用户信息' })
  userInfo: UserInfo;

  @ApiProperty()
  auth: Auth;
}
