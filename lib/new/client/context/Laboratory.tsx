import React from 'react';

type LaboratoryProps = {
  experiments: any;
  children: React.ReactNode;
};

type LaboratoryContext = {
  experiments: any;
};

export const LaboratoryContext = React.createContext({} as LaboratoryContext);

const Laboratory = (props: LaboratoryProps) => {
  const { experiments, children } = props;
  return (
    <LaboratoryContext.Provider value={{ experiments }}>
      {children}
    </LaboratoryContext.Provider>
  );
};

export { Laboratory };
