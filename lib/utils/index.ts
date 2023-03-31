import {
  DEVELOPMENT,
  PRODUCTION,
  TEST,
  DEV,
  PRO,
  ON,
  OFF,
  COOKIE_PREFIX,
  MISSING_CONFIG_ERROR,
  VARIANT_ERROR,
} from './constants';

import type {
  Configuration,
  Experiments,
  Experiment,
  Variant,
  Environment,
  Env,
  Result,
} from './schema';
import { experimentsSchema, environmentSchema } from './schema';

export const isError = <T>(payload: Result<T>): payload is Error => {
  return payload instanceof Error;
};

export const isExperimentRunning = (
  experiment: Experiment,
  environment: Environment
): Result<boolean> => {
  const configuration = getConfiguration(experiment, environment);
  if (isError(configuration)) return configuration;
  switch (configuration.running) {
    case OFF:
      return false;
    case ON:
      return true;
    default:
      return false;
  }
};

export const getExperiments = (abConfig: any): Result<Experiments> => {
  const config = experimentsSchema.safeParse(abConfig);
  if (config.success) {
    return config.data;
  } else {
    return new Error(config.error.message);
  }
};

export const getConfiguration = (
  experiment: Experiment,
  environment: Environment
): Result<Configuration> => {
  const configuration = experiment[environment];
  if (!configuration) return new Error(MISSING_CONFIG_ERROR(environment));
  else return configuration;
};

export const getEnvironment = (): Result<Environment> => {
  const environment = environmentSchema.safeParse(process.env.NODE_ENV);
  if (environment.success) {
    return environment.data;
  } else {
    return new Error(environment.error.message);
  }
};

export const getVariant = (
  experiment: Experiment,
  configuration: Configuration
): Result<Variant> => {
  let random = Math.random() * 100;
  const variant = experiment.variants.find((variant) => {
    if (configuration.weights[variant.id] >= random) return true;
    random -= configuration.weights[variant.id];
  });
  if (!variant) {
    return Error(VARIANT_ERROR);
  }
  return variant;
};

export const getEnvAlias = (environment: Environment): Env => {
  switch (environment) {
    case DEVELOPMENT:
      return DEV;
    case PRODUCTION:
      return PRO;
    case TEST:
      return TEST;
    default:
      return DEV;
  }
};

export const getCookieName = (
  experiment: Experiment,
  environment: Environment
): string => {
  const prefix = experiment.prefix || COOKIE_PREFIX;
  const id = experiment.id;
  return `${prefix}.${id}.${getEnvAlias(environment)}`;
};
