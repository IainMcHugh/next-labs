// import fs from 'fs/promises';
import path from 'path';

import { LAB_PATH, AB_CONFIG, CONFIG_ERROR } from './constants';
import { LabOptions } from './schema';

const getConfigPath = (options?: LabOptions) => {
  if (options?.path) {
    return path.resolve(options.path);
  } else return path.resolve(`${LAB_PATH}/ab.config.js`);
  // let config: any;
  // try {
  //   if (options && options.path) {
  //     config = await fs.readFile(options.path);
  //   } else {
  //     config = await fs.readFile(`${LAB_PATH}/${AB_CONFIG}`);
  //   }
  //   return JSON.parse(config.toString());
  // } catch (error) {
  //   return new Error(CONFIG_ERROR);
  // }
};

export { getConfigPath };
