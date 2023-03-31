import { z } from 'zod';

import { SETTING_REQUIRED_ERROR } from '../global/global.constants';
import { isNoSetting, runningSchema } from '../global/global.schema';

const variantSchema = z.object({ id: z.number(), name: z.string() });

const mvtVariantSchema = z.object({
  id: z.number(),
  name: z.string(),
  variants: z.array(variantSchema),
});

export const mvtSettingsSchema = z.object({
  running: runningSchema,
});

const mvtExperimentSchema = z
  .object({
    name: z.string(),
    id: z.string(),
    variants: z.array(mvtVariantSchema),
    development: z.optional(mvtSettingsSchema),
    production: z.optional(mvtSettingsSchema),
    test: z.optional(mvtSettingsSchema),
  })
  .superRefine(({ development, production, test }, ctx) => {
    if (isNoSetting(development, production, test)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: SETTING_REQUIRED_ERROR,
      });
    }
  });

export const mvtExperimentsSchema = z.array(mvtExperimentSchema);
export type Variant = z.infer<typeof variantSchema>;
export type MVTVariant = z.infer<typeof mvtVariantSchema>;
export type MVTSetting = z.infer<typeof mvtSettingsSchema>;
export type MVTExperiments = z.infer<typeof mvtExperimentsSchema>;
export type MVTExperiment = z.infer<typeof mvtExperimentSchema>;
