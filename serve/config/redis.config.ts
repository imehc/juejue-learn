import type { Config } from 'types/config';
import { loadConfig } from './database.config';

export const getRedisConfig = () => {
  const config = loadConfig();
  return config.redis as Config.Redis;
};
