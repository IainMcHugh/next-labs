import mvtJSON from '../../../.labs/mvt.config.json';
import { ok, error, getEnvironment, isError } from '../global/global.utils';
import type { Cookie, Result } from '../global/global.types';
import {
  getExperiments,
  getCookie,
  getSettings,
  getVariants,
} from './functions';

const mvt = (): Result<Cookie[]> => {
  const experiments = getExperiments(mvtJSON);
  if (isError(experiments)) return error(experiments.error);
  const environment = getEnvironment();
  if (isError(environment)) return error(environment.error);

  const cookies = experiments.data.map((experiment) => {
    const settings = getSettings(experiment, environment.data);
    if (isError(settings)) return settings;
    const variants = getVariants(experiment);
    const result = getCookie(experiment.id, variants);
    return result;
  });

  const errors = cookies.filter((cookie) => isError(cookie));
  if (errors.length !== 0) return error(errors[0].error as Error);
  return ok(cookies.map(({ data }) => ({ ...(data as Cookie) })));
};

export { mvt };
