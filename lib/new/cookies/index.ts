import type { NextPageContext, GetServerSidePropsContext } from 'next';
import {
  Cookie,
  Option,
  Result,
  cookieAttributes,
} from '../global/global.types';
import { isNull } from '../global/global.utils';

export type UncleanCookie = { [x: string]: string | null } | null | undefined;
export type ABCookie = { [x: string]: string };
export type Context = NextPageContext | GetServerSidePropsContext;

const computeCookies = (serverCookie: string): Option<Cookie[]> => {
  if (!serverCookie) return null;
  const cookies = serverCookie.trim().split(';');
  const computedCookies: Cookie[] = [];
  let idx = 0;
  for (const chunk in cookies) {
    if (idx === 0) {
      const [key, value] = chunk.split('=');
      computedCookies[idx] = {
        key,
        value,
        config: null,
      };
      idx = 1;
    }
    if (chunk.indexOf('=') === -1) {
      // it's a boolean cookie attribute
      computedCookies[idx] = {
        ...computedCookies[idx],
        config: {
          ...computeCookies[idx].config,
        },
      };
    } else {
      const [key, value] = chunk.split('=');
      if (cookieAttributes.includes(key)) {
        // it's a cookie attribute
      } else {
        //  we're setting a new cookie;
        idx = idx + 1;
        computedCookies[idx] = {
          key,
          value,
          config: null,
        };
      }
    }
  }
  return [];
};

class Cookies {
  private cookies: Option<Cookie[]> = null;
  constructor(cookies: string) {
    this.cookies = this.create(cookies);
  }

  private create(cookieString: string): Option<Cookie[]> {
    return [];
  }

  get(): Option<Cookie[]> {
    return this.cookies;
  }

  findOne(name: string): Option<Cookie> {
    if (isNull(this.cookies)) return null;
    const cookie = this.cookies.find((c) => c.key === name);
    if (!cookie) return null;
    return cookie;
  }

  findMany(names: string[]): Option<Cookie[]> {
    let cookies: Cookie[] = [];
    names.forEach((name) => {
      if (!isNull(this.cookies)) {
        const cookie = this.cookies.find((c) => c.key === name);
        if (cookie) cookies.push(cookie);
      }
    });
    return cookies;
  }

  update(id: string, value: Cookie): Result<void> {
    if (isNull(this.cookies))
      return new Error('cookie does not exist to update');
    const cookies = [...this.cookies];
    const newCookies = cookies.map((c) => {
      if (c.key === id) return value;
      else return c;
    });
    this.cookies = newCookies;
  }

  delete(id: string): Result<void> {
    if (isNull(this.cookies))
      return new Error('cookie does not exist to delete');
    const cookies = [...this.cookies];
    const newCookies = cookies.map((c) => {
      if (c.key === id)
        return { ...c, config: { ...c.config, expiry: Date.now().toString() } };
      else return c;
    });
    this.cookies = newCookies;
  }
}

const a = new Cookies('abcd=1;xyz9876=1-0');
const cookies = a.get();
const c = a.findOne('abcd1234');
a.findMany(['abcd1234', 'xyz9876']);
a.update('abcd1234', { key: '', value: '', config: null });
a.delete('xyz1234');

export const getCookie = (
  name: string,
  cookieString: string
): Option<Cookie> => {
  const cookieName = `${name}=`;
  const decodedCookie = decodeURIComponent(cookieString);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    let current = cookieArray[i];
    while (current.charAt(0) === ' ') {
      current = current.substring(1);
    }
    if (current.indexOf(cookieName) === 0) {
      const cookieValue = current.substring(cookieName.length, current.length);
      return {
        key: name,
        value: cookieValue,
        config: null,
      };
    }
  }
  return null;
};

export const clearCookie = (cookie: string) => {
  return `${cookie}=;Expires: ${Date.now()}`;
};

export const cleanCookies = (cookies: UncleanCookie[]): ABCookie[] => {
  const nonEmptyCookies = cookies.filter(Boolean) as {
    [x: string]: string | null;
  }[];
  return nonEmptyCookies.filter((a) => Object.values(a)[0] !== null) as {
    [x: string]: string;
  }[];
};

export const formatCookies = (cookies: ABCookie[]) => {
  return cookies.reduce<string[]>((acc, curr) => {
    return [...acc, `${Object.keys(curr)[0]}=${Object.values(curr)[0]};`];
  }, []);
};
