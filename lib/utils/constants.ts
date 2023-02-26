import type { Environment } from './schema';

export const AB_CONFIG = '.labs/ab.config.json';
export const COOKIE_PREFIX = 'ab';
export const DEVELOPMENT = 'development';
export const DEV = 'dev';
export const PRODUCTION = 'production';
export const PRO = 'pro';
export const TEST = 'test';
export const ON = 'on';
export const OFF = 'off';
export const CONFIG_REQUIRED_ERROR = 'at least one configuration must be set';
export const MISSING_CONFIG_ERROR = (env: Environment) =>
  `no configuration for ${env} environment`;
export const MISMATCH_ERROR = 'mismatch between amount of variants and weights';
export const WEIGHT_COUNT_ERROR = (env: Environment) =>
  `weights must total 100 (check your ${env} configuration)`;
export const VARIANT_ERROR = 'there was some error calculating the variant';
