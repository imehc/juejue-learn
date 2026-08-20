type baseKeys = 'host' | 'port';
type RedisConfig = `redis-server.${baseKeys | 'db'}`;
type MysqlConfig =
  `mysql-server.${baseKeys | 'username' | 'password' | 'database'}`;
// 对象存储走标准 S3 协议（当前实现是 RustFS），键名保持 oss-* 中立，
// 不绑定具体实现
type OssConfig =
  `oss-server.${'endpoint' | 'port' | 'use-ssl' | 'region' | 'access-key' | 'secret-key' | 'bucket-name' | 'expires'}`;
type NodemailerConfig = `nodemailer-server.${baseKeys | 'user' | 'pass'}`;
type WinstonConfig =
  `winston.log-${'level' | 'dirname' | 'filename' | 'date-pattern' | 'max-size'}`;
type GoogleLoginConfig =
  `google.login.${'client-id' | 'client-secret' | 'callback-url' | 'redirect-url'}`;
type GithubLoginConfig =
  `github.login.${'client-id' | 'client-secret' | 'callback-url' | 'redirect-url'}`;

type JwtConfig =
  `jwt.${'secret' | 'access-token-expires-time' | 'access-refresh-expires-time'}`;
type NestServerConfig = `nest-server.${'port' | 'doc-url'}`;

export declare type ConfigurationImpl = {
  [K in
    | RedisConfig
    | MysqlConfig
    | OssConfig
    | NodemailerConfig
    | WinstonConfig
    | GoogleLoginConfig
    | GithubLoginConfig
    | JwtConfig
    | NestServerConfig]: string;
};
