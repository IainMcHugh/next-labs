import { VARIANT_ERROR } from '../../global/global.constants';
import { Environment } from '../../global/global.schema';
import type { Cookie, Result } from '../../global/global.types';
import { mapVariantToCookie } from '../../global/global.utils';
import {
  ABExperiment,
  ABExperiments,
  abExperimentsSchema,
  ABSetting,
  ABVariant,
} from '../schema';

export const getExperiments = (config: any): Result<ABExperiments> => {
  const result = abExperimentsSchema.safeParse(config);
  if (result.success) {
    return result.data;
  } else {
    return new Error(result.error.message);
  }
};

export const getSettings = (
  experiment: ABExperiment,
  environment: Environment
): Result<ABSetting> => {
  const result = experiment[environment];
  if (!result)
    return new Error(
      `${experiment.name} settings missing for ${environment} environment.`
    );
  else return result;
};

export const getVariants = (experiment: ABExperiment): ABVariant[] => {
  return experiment.variants;
};

export const getCookie = (
  id: string,
  variants: ABVariant[],
  settings: ABSetting
): Result<Cookie> => {
  let random = Math.random() * 100;
  const variant = variants.find((variant) => {
    if (settings.weights[variant.id] >= random) return true;
    random -= settings.weights[variant.id];
  });
  if (!variant) return Error(VARIANT_ERROR);
  else
    return mapVariantToCookie(id, {
      ...variant,
      id: variant.id.toString(),
    });
};
