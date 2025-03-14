import { join } from 'path';
import { load } from 'js-yaml';
import { readFileSync } from 'fs';
import { type Config } from 'types/config';

export const loadConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  const yamlFilePath = join(
    __dirname,
    '../../config',
    `config.${environment}.yaml`,
  );
  return load(readFileSync(yamlFilePath, 'utf8')) as Record<string, any>;
};

export const getDatabaseConfig = () => {
  const config = loadConfig();
  return config.database as Config.Database;
};
