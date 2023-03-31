import { VARIANT_ERROR } from '../../global/global.constants';
import type { Environment, Variant } from '../../global/global.schema';
import type { Cookie, Result } from '../../global/global.types';
import { mapVariantToCookie } from '../../global/global.utils';
import {
  MVTExperiment,
  MVTExperiments,
  mvtExperimentsSchema,
  MVTSetting,
  MVTVariant,
} from '../schema';

type FlatVariant = {
  name: string;
  id: string;
};

export const getExperiments = (config: any): Result<MVTExperiments> => {
  const result = mvtExperimentsSchema.safeParse(config);
  if (result.success) {
    return result.data;
  } else {
    return new Error(result.error.message);
  }
};

export const getSettings = (
  experiment: MVTExperiment,
  environment: Environment
): Result<MVTSetting> => {
  const result = experiment[environment];
  if (!result)
    return new Error(
      `${experiment.name} settings missing for ${environment} environment.`
    );
  else return result;
};

export const getVariants = (experiment: MVTExperiment): MVTVariant[] => {
  return experiment.variants;
};

export const getCookie = (id, variants: MVTVariant[]): Result<Cookie> => {
  let weight = 0;
  const flatVariants: Variant[] = [];
  variants.forEach((variant) => {
    variant.variants.forEach((subvariant) => {
      flatVariants.push({
        name: subvariant.name,
        id: `${variant.id}-${subvariant.id}`,
      });
      weight++;
    });
    weight++;
  });
  const weights: number[] = Array(weight).fill(((1 / weight) * 100).toFixed(2));

  let random = Math.random() * 100;
  const variant = flatVariants.find((_, index) => {
    if (weights[index] >= random) return true;
    random -= weights[index];
  });
  if (!variant) return Error(VARIANT_ERROR);
  else return mapVariantToCookie(id, variant);
};
