import abJSON from '../../../.labs/ab.config.json';
import { getEnvironment, isError } from '../global/global.utils';
import type { Cookie, Result } from '../global/global.types';
import {
  getExperiments,
  getCookie,
  getSettings,
  getVariants,
} from './functions';

const ab = (): Result<Cookie[]> => {
  const experiments = getExperiments(abJSON);
  if (isError(experiments)) return experiments;

  const cookies = experiments.map((experiment) => {
    const environment = getEnvironment();
    if (isError(environment)) return environment;
    const settings = getSettings(experiment, environment);
    if (isError(settings)) return settings;
    const variants = getVariants(experiment);
    const result = getCookie(experiment.id, variants, settings);
    return result;
  });

  const errors = cookies.filter((cookie) => isError(cookie)) as Error[];
  if (errors.length !== 0) return errors[0];
  else return cookies as Cookie[];
};

export { ab };
