import { z } from 'zod';

import {
  DEVELOPMENT,
  DEV,
  PRODUCTION,
  PRO,
  TEST,
  ON,
  OFF,
  CONFIG_REQUIRED_ERROR,
  MISMATCH_ERROR,
  WEIGHT_COUNT_ERROR,
} from './constants';

const isNoConfigurations = (
  dev?: Configuration,
  prod?: Configuration,
  test?: Configuration
) => {
  return Boolean(dev === undefined && prod === undefined && test === undefined);
};

const isMismatchConfiguration = (
  variantCount: number,
  configuration?: Configuration
) => {
  if (configuration) {
    const weightCount = configuration.weights.length;
    return Boolean(variantCount !== weightCount);
  } else return false;
};

const runningSchema = z.union([z.literal(ON), z.literal(OFF)]);

const configurationSchema = z.object({
  running: runningSchema,
  weights: z.array(z.number()).superRefine((arr, ctx) => {
    const total = arr.reduce((acc, curr) => acc + curr);
    if (total !== 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: WEIGHT_COUNT_ERROR,
      });
    }
  }),
});

const variantSchema = z.object({ id: z.number(), name: z.string() });

const experimentSchema = z
  .object({
    name: z.string(),
    id: z.string(),
    prefix: z.optional(z.coerce.string().max(4)),
    variants: z.array(variantSchema),
    development: z.optional(configurationSchema),
    production: z.optional(configurationSchema),
    test: z.optional(configurationSchema),
  })
  .superRefine(({ development, production, test, variants }, ctx) => {
    if (isNoConfigurations(development, production, test)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: CONFIG_REQUIRED_ERROR,
      });
    }
    const variantCount = variants.length;
    if (isMismatchConfiguration(variantCount, development)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MISMATCH_ERROR,
      });
    }
    if (isMismatchConfiguration(variantCount, production)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MISMATCH_ERROR,
      });
    }
    if (isMismatchConfiguration(variantCount, test)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MISMATCH_ERROR,
      });
    }
  });

export const environmentSchema = z.union([
  z.literal(DEVELOPMENT),
  z.literal(PRODUCTION),
  z.literal(TEST),
]);

export const envSchema = z.union([
  z.literal(DEV),
  z.literal(PRO),
  z.literal(TEST),
]);

export const experimentsSchema = z.array(experimentSchema);

export type Running = z.infer<typeof runningSchema>;
export type Experiments = z.infer<typeof experimentsSchema>;
export type Experiment = z.infer<typeof experimentSchema>;
export type Variant = z.infer<typeof variantSchema>;
export type Configuration = z.infer<typeof configurationSchema>;
export type Environment = z.infer<typeof environmentSchema>;
export type Env = z.infer<typeof envSchema>;
export type Result<T> = T | Error;

export type LabOptions = {
  path?: string;
};
