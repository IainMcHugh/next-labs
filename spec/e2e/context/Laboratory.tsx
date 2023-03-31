import type { ReactNode } from 'react';
import { useState, useEffect, createContext, useContext } from 'react';
import { experiment } from '../../../dist';

type LabProviderProps = {
  children: ReactNode;
  experimentID: string;
};

type LabContext = {
  variant: null | number;
};

const LabContext = createContext({} as LabContext);

const LabProvider = (props: LabProviderProps) => {
  const { children, experimentID } = props;
  const [variant, setVariant] = useState<number | null>(null);

  useEffect(() => {
    const experiment1 = experiment.ab(experimentID);
    setVariant(experiment1.getVariant());
  }, []);
  return (
    <LabContext.Provider value={{ variant }}>{children}</LabContext.Provider>
  );
};

const useLab = () => useContext(LabContext);

export { LabProvider, useLab };
