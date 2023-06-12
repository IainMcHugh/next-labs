import type {
  Context,
  Callback,
  Option,
  LabResponse,
  Experiments,
} from './global/global.types';
import { ab } from './ab';
import { mvt } from './mvt';
import { isError, formatCookies, mapCookieToData } from './global/global.utils';
import { Laboratory } from './client/context/Laboratory';
import { useLab } from './client/hooks/useLab';
import NextLab from './client/api';
import { labnotes } from './client/api/logger';

const lab = (context: Context, callback: Callback): Option<LabResponse> => {
  const serverCookie = context.req?.headers.cookie;
  const abCookies = ab();
  if (isError(abCookies)) {
    callback(abCookies.error);
    return null;
  }
  const mvtCookies = mvt();
  if (isError(mvtCookies)) {
    callback(mvtCookies.error);
    return null;
  }
  const cookies = [
    ...formatCookies(abCookies.data),
    ...formatCookies(mvtCookies.data),
  ];
  const experiments = {
    ab: mapCookieToData(abCookies.data),
    mvt: mapCookieToData(mvtCookies.data),
  };

  return {
    cookies,
    experiments,
  };
};

export default lab;
export { Laboratory, useLab, NextLab, labnotes };
export type { Experiments };
