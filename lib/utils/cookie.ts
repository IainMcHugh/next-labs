import type { NextPageContext, GetServerSidePropsContext } from 'next';

export type UncleanCookie = { [x: string]: string | null } | null | undefined;
export type ABCookie = { [x: string]: string };
export type Context = NextPageContext | GetServerSidePropsContext;

export const getServerCookie = (name: string, cookie: string | undefined) => {
  if (cookie) {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
      let current = cookieArray[i];
      while (current.charAt(0) === ' ') {
        current = current.substring(1);
      }
      if (current.indexOf(cookieName) === 0) {
        const cookieValue = current.substring(
          cookieName.length,
          current.length
        );
        return cookieValue;
      }
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
