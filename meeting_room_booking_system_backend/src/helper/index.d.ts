import { type Permission } from 'src/user/vo/login-user.vo';

export interface JwtUserData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: Permission[];
}

/** 第三方登录参数 */
export interface GoogleRequest {
  email: string;
  firstName?: string;
  lastName?: string;
  picture: string;
}

/** 第三方登录参数 */
export interface GithubRequest {
  username: string;
  displayName: string;
  photos?: {
    value: string;
  }[];
  email: string;
}

declare global {
  interface Request {
    user: JwtUserData;
    path: string;
    ip: string;
  }
  interface Response {
    statusCode: number;
  }
  interface Headers {
    authorization?: string;
  }
}

/** 返回统一的返回格式, 由于openapi 直接返回数据 */
export interface UnifiledResponse<T> {
  code: number;
  message: 'success' | 'fail';
  data: T;
}
