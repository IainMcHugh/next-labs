import { z } from 'zod';
import { ABSetting } from '../ab/schema';
import { MVTSetting } from '../mvt/schema';

import {
  ON,
  OFF,
  DEV,
  DEVELOPMENT,
  PRO,
  PRODUCTION,
  TEST,
} from './global.constants';

type Setting = ABSetting | MVTSetting;

export const isNoSetting = (dev?: Setting, prod?: Setting, test?: Setting) => {
  return Boolean(dev === undefined && prod === undefined && test === undefined);
};

export const variantSchema = z.object({ name: z.string(), id: z.string() });

export const runningSchema = z.union([z.literal(ON), z.literal(OFF)]);

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

export type Variant = z.infer<typeof variantSchema>;
export type Running = z.infer<typeof runningSchema>;
export type Environment = z.infer<typeof environmentSchema>;
export type Env = z.infer<typeof envSchema>;
