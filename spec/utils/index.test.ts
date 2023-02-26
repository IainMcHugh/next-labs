import { describe, test, expect, vi } from 'vitest';

import type { Experiment, Environment } from '../../lib/utils/schema';
import {
  isError,
  isExperimentRunning,
  getCookieName,
  getEnvironment,
  getExperiments,
  getConfiguration,
} from '../../lib/utils';

const mockEnvironment: Environment = 'development';

const mockExperimentInvalidConfig: Experiment = {
  name: 'MOCK_NAME',
  id: 'MOCK_ID',
  variants: [
    { id: 0, name: 'MOCK_VARIANT_NAME_0' },
    { id: 1, name: 'MOCK_VARIANT_NAME_1' },
  ],
};

const mockExperimentInvalidMismatch: Experiment = {
  name: 'MOCK_NAME',
  id: 'MOCK_ID',
  variants: [
    { id: 0, name: 'MOCK_VARIANT_NAME_0' },
    { id: 1, name: 'MOCK_VARIANT_NAME_1' },
  ],
  test: {
    running: 'off',
    weights: [60, 20, 20],
  },
};

const mockExperimentInvalidWeight: Experiment = {
  name: 'MOCK_NAME',
  id: 'MOCK_ID',
  variants: [
    { id: 0, name: 'MOCK_VARIANT_NAME_0' },
    { id: 1, name: 'MOCK_VARIANT_NAME_1' },
  ],
  test: {
    running: 'off',
    weights: [20, 20],
  },
};

const mockExperiment: Experiment = {
  name: 'MOCK_NAME',
  id: 'MOCK_ID',
  variants: [
    { id: 0, name: 'MOCK_VARIANT_NAME_0' },
    { id: 1, name: 'MOCK_VARIANT_NAME_1' },
  ],
  development: {
    running: 'off',
    weights: [100, 0],
  },
  production: {
    running: 'on',
    weights: [0, 100],
  },
};

describe('utils', () => {
  test('isError (true)', () => {
    const result = isError(new Error('MOCK_ERROR'));
    expect(result).toBeTruthy();
  });

  test('isError (false)', () => {
    const result = isError({ some: 'data' });
    expect(result).toBeFalsy();
  });

  test('isError (null)', () => {
    const result = isError(null);
    expect(result).toBeFalsy();
  });

  test('is experiment running (on)', () => {
    const running = isExperimentRunning(mockExperiment, 'production');
    expect(running).toBeTruthy();
  });

  test('is experiment running (off)', () => {
    const running = isExperimentRunning(mockExperiment, mockEnvironment);
    expect(running).toBeFalsy();
  });

  test('is experiment running (error)', () => {
    const running = isExperimentRunning(
      mockExperimentInvalidConfig,
      mockEnvironment
    );
    expect(running).toBeInstanceOf(Error);
  });

  test('get cookie name', () => {
    const cookie = getCookieName(mockExperiment, mockEnvironment);
    expect(cookie).toBe('ab.MOCK_NAME.dev');
  });

  test('get cookie name (custom prefix)', () => {
    const cookie = getCookieName(
      { ...mockExperiment, prefix: 'xyz' },
      mockEnvironment
    );
    expect(cookie).toBe('xyz.MOCK_NAME.dev');
  });

  test('get cookie name (prod env)', () => {
    const cookie = getCookieName(mockExperiment, 'production');
    expect(cookie).toBe('ab.MOCK_NAME.pro');
  });

  test('get cookie name (test env)', () => {
    const cookie = getCookieName(mockExperiment, 'test');
    expect(cookie).toBe('ab.MOCK_NAME.test');
  });

  test('get environment', () => {
    const environment = getEnvironment();
    expect(environment).toBe('test');
  });

  test('get environment (error)', () => {
    const OLD_ENV = process.env;
    vi.resetModules(); // Most important - it clears the cache
    //@ts-ignore
    process.env = { NODE_ENV: '' };
    const environment = getEnvironment();
    expect(environment).toBeInstanceOf(Error);
    process.env = OLD_ENV; // Restore old environment
  });

  test('get experiments', () => {
    const experiments = getExperiments([mockExperiment]);
    expect(experiments).toStrictEqual([mockExperiment]);
  });

  test('get experiments (invalid)', () => {
    const experiments = getExperiments([{ ...mockExperiment, name: 1234 }]);
    expect(experiments).toBeInstanceOf(Error);
  });

  test('get experiments (no config)', () => {
    const experiments = getExperiments([mockExperimentInvalidConfig]);
    expect(experiments).toBeInstanceOf(Error);
    const error = () => {
      throw experiments;
    };
    expect(error).toThrow('at least one configuration must be set');
  });

  test('get experiments (mismatched variants and weights)', () => {
    const experiments = getExperiments([mockExperimentInvalidMismatch]);
    expect(experiments).toBeInstanceOf(Error);
    const error = () => {
      throw experiments;
    };
    expect(error).toThrow('mismatch between amount of variants and weights');
  });

  test('get experiments (weight total 100)', () => {
    const experiments = getExperiments([mockExperimentInvalidWeight]);
    expect(experiments).toBeInstanceOf(Error);
    const error = () => {
      throw experiments;
    };
    expect(error).toThrow(
      'weights must total 100 (check your test configuration)'
    );
  });

  test('get configuration', () => {
    const config = getConfiguration(mockExperiment, mockEnvironment);
    expect(config).toStrictEqual(mockExperiment[mockEnvironment]);
  });

  test('get configuration (no config for environment)', () => {
    const config = getConfiguration(mockExperiment, 'test');
    expect(config).toBeInstanceOf(Error);
    const error = () => {
      throw config;
    };
    expect(error).toThrow('no configuration for test environment');
  });
});
