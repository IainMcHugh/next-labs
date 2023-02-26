import fs from 'fs';

import { AB_CONFIG } from './constants';

const getConfig = async () => {
  const file = fs.readFileSync(AB_CONFIG);
  const config = JSON.parse(file.toString());
  return config;
};

export { getConfig };
