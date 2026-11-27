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
    // undici 的 Headers 类型只有方法、没有索引签名，取值只能靠这里逐个声明；
    // 运行时 headers 是 express 的普通对象，字面量读取才是正确姿势
    'user-agent'?: string;
  }
}

/** 返回统一的返回格式, 由于openapi 直接返回数据 */
export interface UnifiledResponse<T> {
  code: number;
  message: 'success' | 'fail';
  data: T;
}
