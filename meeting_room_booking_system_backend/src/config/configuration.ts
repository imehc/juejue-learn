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
