import type {
  Context,
  Callback,
  Option,
  LabResponse,
} from './global/global.types';
import { ab } from './ab';
import { mvt } from './mvt';
import { isError } from '../utils';
import { mapCookieToCookie, mapCookieToData } from './global/global.utils';
import { Laboratory } from './client/context/Laboratory';
import { useLab } from './client/hooks/useLab';

const lab = (_context: Context, callback: Callback): Option<LabResponse> => {
  const abCookies = ab();
  if (isError(abCookies)) {
    callback(abCookies);
    return null;
  }
  console.log('1');
  const mvtCookies = mvt();
  if (isError(mvtCookies)) {
    callback(mvtCookies);
    return null;
  }
  console.log('2');
  const cookies = [
    ...mapCookieToCookie(abCookies),
    ...mapCookieToCookie(mvtCookies),
  ];
  const data = {
    ab: mapCookieToData(abCookies),
    mvt: mapCookieToData(mvtCookies),
  };

  return {
    cookies,
    data,
  };
};

export default lab;
export { Laboratory, useLab };
