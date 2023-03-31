import { z } from 'zod';

import {
  SETTING_REQUIRED_ERROR,
  MISMATCH_ERROR,
  WEIGHT_COUNT_ERROR,
} from '../global/global.constants';
import { isNoSetting, runningSchema } from '../global/global.schema';

export const isMismatchSettings = (
  variantCount: number,
  settings?: ABSetting
) => {
  if (settings) {
    const weightCount = settings.weights.length;
    return Boolean(variantCount !== weightCount);
  } else return false;
};

const abVariantSchema = z.object({ id: z.number(), name: z.string() });

export const abSettingsSchema = z.object({
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

const abExperimentSchema = z
  .object({
    name: z.string(),
    id: z.string(),
    variants: z.array(abVariantSchema),
    development: z.optional(abSettingsSchema),
    production: z.optional(abSettingsSchema),
    test: z.optional(abSettingsSchema),
  })
  .superRefine(({ development, production, test, variants }, ctx) => {
    if (isNoSetting(development, production, test)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: SETTING_REQUIRED_ERROR,
      });
    }
    const variantCount = variants.length;
    if (isMismatchSettings(variantCount, development)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MISMATCH_ERROR,
      });
    }
    if (isMismatchSettings(variantCount, production)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MISMATCH_ERROR,
      });
    }
    if (isMismatchSettings(variantCount, test)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: MISMATCH_ERROR,
      });
    }
  });

export const abExperimentsSchema = z.array(abExperimentSchema);
export type ABVariant = z.infer<typeof abVariantSchema>;
export type ABSetting = z.infer<typeof abSettingsSchema>;
export type ABExperiments = z.infer<typeof abExperimentsSchema>;
export type ABExperiment = z.infer<typeof abExperimentSchema>;
