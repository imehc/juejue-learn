import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { resolve } from 'path';
import { isProduction } from './utils';

const YAML_CONFIG_FILENAME = isProduction
  ? '.env.production.yaml'
  : '.env.dev.yaml';

export default () => {
  return yaml.load(
    readFileSync(resolve(__dirname, `../../${YAML_CONFIG_FILENAME}`), 'utf8'),
  ) as Record<string, any>;
};

type baseKeys = 'host' | 'port';
type RedisConfig = `redis-server.${baseKeys | 'db'}`;
type NodemailerConfig = `nodemailer-server.${baseKeys | 'user' | 'pass'}`;
type NestServerConfig = `nest-server.${'port' | 'doc-url'}`;
type JwtConfig =
  `jwt.${'access-token-secret' | 'refresh-token-secret' | 'access-token-expires-time' | 'refresh-token-expires-time'}`;
type WeatherConfig = `weather.${'key'}`;
type MinioConfig =
  `minio-server.${'endpoint' | 'port' | 'access-key' | 'secret-key' | 'bucket-name' | 'expires'}`;

export declare type ConfigurationImpl = {
  [K in
    | RedisConfig
    | NodemailerConfig
    | NestServerConfig
    | JwtConfig
    | WeatherConfig
    | MinioConfig
    ]: string;
};
