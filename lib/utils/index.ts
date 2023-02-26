import {
  DEVELOPMENT,
  PRODUCTION,
  TEST,
  DEV,
  PRO,
  ON,
  OFF,
  COOKIE_PREFIX,
  CONFIG_REQUIRED_ERROR,
  MISMATCH_ERROR,
  MISSING_CONFIG_ERROR,
  WEIGHT_COUNT_ERROR,
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

const validateConfiguration = (
  variantCount: number,
  environment: Environment,
  configuration?: Configuration
): Result<void> => {
  if (configuration) {
    const weightCount = configuration.weights.length;
    if (variantCount !== weightCount) {
      return new Error(MISMATCH_ERROR);
    }
    const totalWeight = configuration.weights.reduce((acc, curr) => acc + curr);
    if (totalWeight !== 100) {
      return new Error(WEIGHT_COUNT_ERROR(environment));
    }
  }
};

export const getExperiments = (abConfig: any): Result<Experiments> => {
  const config = experimentsSchema.safeParse(abConfig);
  if (config.success) {
    for (let i = 0; i < config.data.length; i++) {
      const experiment = config.data[i] as Experiment;
      const variantCount = experiment.variants.length;
      const dev = experiment.development;
      const prod = experiment.production;
      const test = experiment.test;
      if (!dev && !prod && !test) {
        return new Error(CONFIG_REQUIRED_ERROR);
      }
      const devError = validateConfiguration(variantCount, DEVELOPMENT, dev);
      if (devError) return devError;
      const prodError = validateConfiguration(variantCount, PRODUCTION, prod);
      if (prodError) return prodError;
      const testError = validateConfiguration(variantCount, TEST, test);
      if (testError) return testError;
    }
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

const getEnvAlias = (environment: Environment): Env => {
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
  const name = experiment.name;
  return `${prefix}.${name}.${getEnvAlias(environment)}`;
};
