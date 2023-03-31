import { getConfigPath } from './utils/config';
import type { LabOptions } from './utils/schema';
import {
  type Context,
  type ABCookie,
  getServerCookie,
  cleanCookies,
  formatCookies,
  clearCookie,
} from './utils/cookie';
import {
  isError,
  isExperimentRunning,
  getExperiments,
  getConfiguration,
  getEnvironment,
  getCookieName,
  getVariant,
} from './utils';
import { ab } from './ab';

const lab = async (
  context: Context,
  options: LabOptions,
  cb?: (err: Error) => void
): Promise<ABCookie[] | null> => {
  const serverCookie = context.req?.headers.cookie;
  const configPath = getConfigPath(options);
  const experiments = getExperiments(require(configPath));
  if (isError(experiments)) {
    cb && cb(experiments);
    return null;
  }
  const environment = getEnvironment();
  if (isError(environment)) {
    cb && cb(environment);
    return null;
  }
  const res = context.res;
  const cookies = experiments.map((experiment) => {
    const configuration = getConfiguration(experiment, environment);
    if (isError(configuration)) {
      cb && cb(configuration);
      return null;
    }
    const COOKIE_NAME = getCookieName(experiment, environment);
    let cookie = getServerCookie(COOKIE_NAME, serverCookie);
    const isRunning = isExperimentRunning(experiment, environment);
    if (isError(isRunning)) {
      cb && cb(isRunning);
      return null;
    }
    if (cookie && !isRunning) {
      res?.setHeader('set-cookie', clearCookie(COOKIE_NAME));
      return null;
    }
    if (!cookie && isRunning) {
      const variant = getVariant(experiment, configuration);
      if (isError(variant)) {
        cb && cb(variant);
        return null;
      }
      cookie = variant.id.toString();
    }
    return { [COOKIE_NAME]: cookie };
  });
  const cleanedCookies = cleanCookies(cookies);
  if (cleanedCookies.length !== 0) {
    res?.setHeader('set-cookie', formatCookies(cleanedCookies));
    return cleanedCookies;
  } else return null;
};

const experiment = {
  ab,
};

export { ABCookie };
export { experiment };
export default lab;
