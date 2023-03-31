import type { AB } from './ab.types';
import type { ABCookie } from '../../dist';
import { cookie } from '../utils/cookie';
import { getEnvAlias } from '../utils';

const ab: AB = (experimentID) => {
  const { getAll } = cookie();
  const allCookies = getAll();
  const abCookieArr = Object.entries(allCookies).filter(([k, v]) => {
    if (
      k.includes(experimentID) &&
      k.includes(getEnvAlias(process.env.NODE_ENV))
    )
      return true;
    else return false;
  });
  let abCookie: null | ABCookie;
  let abCookieKey: null | string;
  let abCookieValue: null | string;
  if (abCookieArr.length !== 0) {
    abCookieKey = abCookieArr[0][0];
    abCookieValue = abCookieArr[0][1];
    abCookie = { [abCookieKey]: abCookieValue };
    console.log({ abCookie });
  }
  const getVariant = () => {
    if (abCookieValue) return parseInt(abCookieValue);
    else return null;
  };
  const isControl = () => {
    if (abCookieValue) return Boolean(abCookieValue === '0');
    else return null;
  };
  const isVariant = (variant: number) => {
    if (abCookieValue) return Boolean(parseInt(abCookieValue) === variant);
    else return null;
  };

  return {
    getVariant,
    isControl,
    isVariant,
  };
};

export { ab };
