import React from 'react';

import type { Experiments, Option } from '../../global/global.types';
import { useLaboratory } from '../hooks/useLaboratory';

type LaboratoryProps = {
  experiments: Option<Experiments>;
  children: React.ReactNode;
};

export type LaboratoryContext = {
  ab: {
    isControl: (id: string) => Option<boolean>;
    get: (id: string) => Option<number>;
  };
  mvt: {
    get: (id: string) => Option<[number, number]>;
    getPrimaryVariant: (id: string) => Option<number>;
    getSecondaryVariant: (id: string) => Option<number>;
  };
};

export const LaboratoryContext = React.createContext({} as LaboratoryContext);

const Laboratory = (props: LaboratoryProps) => {
  const { experiments, children } = props;
  const result = useLaboratory(experiments);
  return (
    <LaboratoryContext.Provider value={{ ...result }}>
      {children}
    </LaboratoryContext.Provider>
  );
};

export { Laboratory };
