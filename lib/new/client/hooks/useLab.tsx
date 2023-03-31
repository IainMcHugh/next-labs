import React from 'react';

import { LaboratoryContext } from '../context/Laboratory';

const useLab = () => React.useContext(LaboratoryContext);

export { useLab };
