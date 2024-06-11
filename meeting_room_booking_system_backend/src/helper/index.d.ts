export interface JwtUserData {
  userId: number;
  username: string;
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
