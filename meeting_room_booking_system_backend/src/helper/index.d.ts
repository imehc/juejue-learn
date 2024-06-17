export interface JwtUserData {
  userId: number;
  username: string;
  email: string;
  roles: string[];
  permissions: Permission[];
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
