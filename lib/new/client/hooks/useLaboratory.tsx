import { Data, Experiments, Option } from '../../global/global.types';
import { isNull } from '../../global/global.utils';
import { LaboratoryContext } from '../context/Laboratory';

type UseLaboratory = LaboratoryContext;

const findExperiment = (experiments: Data[], id: string) => {
  return experiments.find(({ name }) => name === id);
};

const useLaboratory = (experiments: Option<Experiments>): UseLaboratory => {
  const isControlAB = (id: string): Option<boolean> => {
    if (isNull(experiments)) return null;
    if (isNull(experiments.ab)) return null;
    const experiment = findExperiment(experiments.ab, id);
    if (!experiment) return null;
    return experiment.id === '0';
  };

  const getAB = (id: string): Option<number> => {
    if (isNull(experiments)) return null;
    if (isNull(experiments.ab)) return null;
    const experiment = findExperiment(experiments.ab, id);
    if (!experiment) return null;
    const variant = parseInt(experiment.id);
    if (Number.isNaN(variant)) return null;
    return variant;
  };

  const getMVT = (id: string): Option<[number, number]> => {
    if (isNull(experiments)) return null;
    if (isNull(experiments.mvt)) return null;
    const experiment = findExperiment(experiments.mvt, id);
    if (!experiment) return null;
    const [primary, secondary] = experiment.id.split('-');
    const primaryVariant = parseInt(primary);
    const secondaryVariant = parseInt(secondary);
    if (Number.isNaN(primaryVariant) || Number.isNaN(secondaryVariant))
      return null;
    return [primaryVariant, secondaryVariant];
  };

  const getPrimaryVariantMVT = (id: string): Option<number> => {
    const result = getMVT(id);
    if (isNull(result)) return null;
    return result[0];
  };

  const getSecondaryVariantMVT = (id: string): Option<number> => {
    const result = getMVT(id);
    if (isNull(result)) return null;
    return result[1];
  };

  return {
    ab: {
      isControl: isControlAB,
      get: getAB,
    },
    mvt: {
      get: getMVT,
      getPrimaryVariant: getPrimaryVariantMVT,
      getSecondaryVariant: getSecondaryVariantMVT,
    },
  };
};

export { useLaboratory };
