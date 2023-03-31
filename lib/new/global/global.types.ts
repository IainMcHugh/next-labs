import type { NextPageContext, GetServerSidePropsContext } from 'next';

export type CookieConfig = {
  domain?: string;
  expiry?: string;
  httpOnly?: boolean;
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

export type Context = NextPageContext | GetServerSidePropsContext;
export type Callback = (error: Error) => void;

export type LabResponse = {
  cookies: string[];
  data: {
    ab: Option<Data[]>;
    mvt: Option<Data[]>;
  };
};

export type Result<T> = T | Error;
export type Option<T> = T | null;
