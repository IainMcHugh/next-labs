import { getConfig } from './utils/config';
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

const ab = async (
  context: Context,
  cb: (err: Error) => void
): Promise<ABCookie[] | null> => {
  const serverCookie = context.req?.headers.cookie;
  const config = await getConfig();
  const experiments = getExperiments(config);
  if (isError(experiments)) {
    cb(experiments);
    return null;
  }
  const environment = getEnvironment();
  if (isError(environment)) {
    cb(environment);
    return null;
  }
  const res = context.res;
  const cookies = experiments.map((experiment) => {
    const configuration = getConfiguration(experiment, environment);
    if (isError(configuration)) {
      cb(configuration);
      return null;
    }
    const COOKIE_NAME = getCookieName(experiment, environment);
    let cookie = getServerCookie(COOKIE_NAME, serverCookie);
    const isRunning = isExperimentRunning(experiment, environment);
    if (isError(isRunning)) {
      cb(isRunning);
      return null;
    }
    if (cookie && !isRunning) {
      res?.setHeader('set-cookie', clearCookie(COOKIE_NAME));
      return null;
    }
    if (!cookie && isRunning) {
      const variant = getVariant(experiment, configuration);
      if (isError(variant)) {
        cb(variant);
        return null;
      }
      cookie = `${experiment.id}.${variant.id}`;
    }
    return { [COOKIE_NAME]: cookie };
  });
  const cleanedCookies = cleanCookies(cookies);
  res?.setHeader('set-cookie', formatCookies(cleanedCookies));
  return cleanedCookies;
};

export { ABCookie };
export default ab;
