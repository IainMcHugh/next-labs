import type {
  Cookie,
  CookieConfig,
  Data,
  Option,
  Result,
  ResultError,
  ResultSuccess,
} from './global.types';
import { Environment, environmentSchema, Variant } from './global.schema';

export const ok = <T>(data: T): ResultSuccess<T> => {
  return { data, error: null };
};

export const isOkay = <T>(data: Result<T>): data is ResultSuccess<T> => {
  return Boolean(data.error === null);
};

export const error = (error: Error): ResultError => {
  return { error, data: null };
};

export const isError = <T>(data: Result<T>): data is ResultError => {
  return Boolean(data.error instanceof Error);
};

export const isNull = <T>(data: Option<T>): data is null => {
  return Boolean(data === null);
};

export const getEnvironment = (): Result<Environment> => {
  const result = environmentSchema.safeParse(process.env.NODE_ENV);
  if (result.success) {
    return ok(result.data);
  } else {
    return error(new Error(result.error.message));
  }
};

export const mapVariantToCookie = (
  id: string,
  variant: Variant,
  config: Cookie['config'] = null
): Cookie => {
  return {
    key: id,
    value: variant.id.toString(),
    config,
  };
};

export const formatCookies = (cookies: Cookie[]): string[] => {
  return cookies.reduce<string[]>((acc, curr) => {
    let cookieConfig: string | null = null;
    if (!isNull(curr.config)) {
      const config: CookieConfig = curr.config;
      cookieConfig = (Object.keys(config) as (keyof Cookie['config'])[])
        .map((key) => `${key}=${config[key] as string};`)
        .join(' ');
    }
    return [...acc, `${curr.key}=${curr.value}; ${cookieConfig ?? ''}`];
  }, []);
};

export const mapCookieToData = (cookies: Cookie[]): Data[] => {
  return cookies.map((cookie) => {
    return {
      name: cookie.key,
      id: cookie.value,
    };
  });
};
