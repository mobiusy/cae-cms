import { readFileSync } from 'fs';
import yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = './app-config/config.yaml';

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
};
