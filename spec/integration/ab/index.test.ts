import { describe, test, expect } from 'vitest';
import { ab } from '../../../lib/ab';

const MOCK_EXPERIMENT_ID = 'MOCK_EXPERIMENT_ID';

describe('ab', () => {
  test('isControl', () => {
    const experiment = ab(MOCK_EXPERIMENT_ID);
    expect(experiment.isControl()).toBeNull();
  });

  test('isVariant', () => {
    const experiment = ab(MOCK_EXPERIMENT_ID);
    expect(experiment.isVariant(1)).toBeNull();
  });

  test('getVariant', () => {
    const experiment = ab(MOCK_EXPERIMENT_ID);
    expect(experiment.getVariant()).toBeNull();
  });
});
