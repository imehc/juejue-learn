import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { resolve } from 'path';

const YAML_CONFIG_FILENAME =
  process.env.NODE_ENVIRONMENT === 'production' ? '.env.yaml' : '.env.dev.yaml';

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
  `jwt.${'secret' | 'access-token-expires-time' | 'access-refresh-expires-time'}`;

export declare type ConfigurationImpl = {
  [K in RedisConfig | NodemailerConfig | NestServerConfig | JwtConfig]: string;
};
