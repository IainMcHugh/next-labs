import { z } from 'zod';

import { DEVELOPMENT, DEV, PRODUCTION, PRO, TEST, ON, OFF } from './constants';

const runningSchema = z.union([z.literal(ON), z.literal(OFF)]);

const configurationSchema = z.object({
  running: runningSchema,
  weights: z.array(z.number()),
});

const variantSchema = z.object({ id: z.number(), name: z.string() });

const experimentSchema = z.object({
  name: z.string(),
  id: z.string(),
  prefix: z.optional(z.coerce.string().max(4)),
  variants: z.array(variantSchema),
  development: z.optional(configurationSchema),
  production: z.optional(configurationSchema),
  test: z.optional(configurationSchema),
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
