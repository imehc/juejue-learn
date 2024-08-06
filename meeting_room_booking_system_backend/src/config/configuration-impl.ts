type baseKeys = 'host' | 'port';
type RedisConfig = `redis-server.${baseKeys | 'db'}`;
type MysqlConfig =
  `mysql-server.${baseKeys | 'username' | 'password' | 'database'}`;
type MinioConfig =
  `minio-server.${'endpoint' | 'port' | 'access-key' | 'secret-key' | 'bucket-name' | 'expires'}`;
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
    | MinioConfig
    | NodemailerConfig
    | WinstonConfig
    | GoogleLoginConfig
    | GithubLoginConfig
    | JwtConfig
    | NestServerConfig]: string;
};
