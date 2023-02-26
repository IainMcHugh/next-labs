import { cosmiconfig } from 'cosmiconfig';

import { AB_CONFIG } from './constants';

const getConfig = async () => {
  const explorer = cosmiconfig(AB_CONFIG);
  const result = await explorer.search();
  if (result?.isEmpty) return null;
  return result?.config;
};

export { getConfig };
