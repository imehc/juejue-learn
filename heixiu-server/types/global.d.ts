declare module 'request-ip' {
  function getClientIp(req: any): string;
  const middleware: (options?: any) => (req: any, res: any, next: any) => void;
  export { getClientIp, middleware };
}