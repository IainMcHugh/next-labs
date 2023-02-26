import type { Experiments } from '../../lib/utils/schema';

export const mockExperiments: Experiments = [
  {
    name: 'experiment-1',
    id: 'dlk1j049dqa',
    variants: [
      { id: 0, name: 'Original' },
      { id: 1, name: 'Variant 1' },
    ],
    test: {
      running: 'on',
      weights: [0, 100],
    },
  },
  {
    name: 'experiment-2',
    id: 'c-d0soasdlkj',
    variants: [
      { id: 0, name: 'Original' },
      { id: 1, name: 'Variant 1' },
    ],
    test: {
      running: 'off',
      weights: [20, 80],
    },
  },
];
