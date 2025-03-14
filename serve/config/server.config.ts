import type { Config } from 'types/config';
import { loadConfig } from './database.config';

export const getServerConfig = () => {
  const config = loadConfig();
  return config.server as Config.Server;
};
