import type { NextPageContext, GetServerSidePropsContext } from 'next';

const COOKIE_ATTRIBUTES = {
  DOMAIN: 'Domain',
  EXPIRY: 'Expires',
  HTTP_ONLY: 'HttpOnly',
  MAX_AGE: 'Max-Age',
  PARTITIONED: 'Partitioned',
  PATH: 'Path',
  SECURE: 'Secure',
};

export const cookieAttributes = [
  COOKIE_ATTRIBUTES.DOMAIN,
  COOKIE_ATTRIBUTES.EXPIRY,
  COOKIE_ATTRIBUTES.HTTP_ONLY,
  COOKIE_ATTRIBUTES.MAX_AGE,
  COOKIE_ATTRIBUTES.PARTITIONED,
  COOKIE_ATTRIBUTES.PATH,
  COOKIE_ATTRIBUTES.SECURE,
];

// Valid cookie attributes as per: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
export type CookieConfig = {
  domain?: string;
  expiry?: string;
  httpOnly?: boolean;
  maxAge?: number;
  partitioned?: boolean;
  path?: string;
  secure?: boolean;
};

export type Cookie = {
  key: string;
  value: string;
  config: Option<CookieConfig>;
};

export type Data = {
  name: string;
  id: string;
};

export type Experiments = {
  ab: Option<Data[]>;
  mvt: Option<Data[]>;
};

export type Context = NextPageContext | GetServerSidePropsContext;
export type Callback = (error: Error) => void;

export type LabResponse = {
  cookies: string[];
  experiments: Experiments;
};

export type Result<T> = ResultSuccess<T> | ResultError;
export type Option<T> = T | null;

export type ResultSuccess<T> = { data: T; error: null };
export type ResultError = { data: null; error: Error };
