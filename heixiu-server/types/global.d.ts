declare module 'request-ip' {
  function getClientIp(req: any): string;
  const middleware: (options?: any) => (req: any, res: any, next: any) => void;
  export { getClientIp, middleware };
}

// 定义process.env类型
namespace NodeJS {
  interface ProcessEnv {
    /** 运行环境 */
    NODE_ENV: 'development' | 'production' | 'test';
    /** minio账号 */
    MINIO_ROOT_USER: string;
    /** minio密码 */
    MINIO_ROOT_PASSWORD: string;
  }
}
