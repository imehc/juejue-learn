interface UserInfo {
  id: number;

  username: string;

  nickName: string;

  email: string;

  headPic: string;

  phoneNumber: string;

  isFrozen: boolean;

  isAdmin: boolean;

  createAt: Date;

  roles: string[];

  permissions: string[];
}

export class LoginUserVo {
  userInfo: UserInfo;

  auth: {
    accessToken: string;

    refreshToken: string;

    // tokenType: 'Bearer';

    expiresIn: number;
  };
}
