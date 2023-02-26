import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';

import type { Context } from '../lib/utils/cookie';
import { mockExperiments } from './mocks';
import * as utils from '../lib/utils';
import ab from '../lib/ab';

const mockCookie = 'MOCK_COOKIE';
const mockSetHeader = vi.fn();
const mockCallback = vi.fn();

const mockContext = {
  req: {
    headers: {
      cookie: mockCookie,
    },
  },
  res: {
    setHeader: mockSetHeader,
  },
} as unknown as Context;

vi.mock('../lib/utils/config', () => {
  return {
    getConfig: vi.fn().mockResolvedValue(mockExperiments),
  };
});

describe('ab', () => {
  test('e2e (happy path)', async () => {
    const result = await ab(mockContext, mockCallback);
    expect(mockSetHeader).toBeCalledWith('set-cookie', [
      'ab.experiment-1.test=dlk1j049dqa.1;',
    ]);
    expect(result).toStrictEqual([{ 'ab.experiment-1.test': 'dlk1j049dqa.1' }]);
  });

  test('e2e (switched off)', async () => {
    vi.spyOn(utils, 'isExperimentRunning').mockReturnValueOnce(false);
    const res = await ab(mockContext, mockCallback);
    expect(res).toStrictEqual([]);
    expect(mockSetHeader).toBeCalled();
  });

  test('e2e (error: invalid experiment config file)', async () => {
    vi.spyOn(utils, 'getExperiments').mockReturnValueOnce(
      new Error('INVALID_CONFIG')
    );
    const res = await ab(mockContext, mockCallback);
    expect(res).toBeNull();
    expect(mockCallback).toBeCalledWith(new Error('INVALID_CONFIG'));
  });

  test('e2e (error: invalid environment)', async () => {
    vi.spyOn(utils, 'getEnvironment').mockReturnValueOnce(
      new Error('INVALID_ENVIRONMENT')
    );
    const res = await ab(mockContext, mockCallback);
    expect(res).toBeNull();
    expect(mockCallback).toBeCalledWith(new Error('INVALID_ENVIRONMENT'));
  });

  test('e2e (error: invalid configuration)', async () => {
    vi.spyOn(utils, 'getConfiguration').mockReturnValueOnce(
      new Error('INVALID_CONFIGURATION')
    );
    const res = await ab(mockContext, mockCallback);
    expect(res).toStrictEqual([]);
    expect(mockCallback).toBeCalledWith(new Error('INVALID_CONFIGURATION'));
  });

  test('e2e (error: invalid configuration)', async () => {
    vi.spyOn(utils, 'isExperimentRunning').mockReturnValueOnce(
      new Error('INVALID_CONFIG')
    );
    const res = await ab(mockContext, mockCallback);
    expect(res).toStrictEqual([]);
    expect(mockCallback).toBeCalledWith(new Error('INVALID_CONFIG'));
  });

  test('e2e (error: invalid variant)', async () => {
    vi.spyOn(utils, 'getVariant').mockReturnValueOnce(
      new Error('INVALID_VARIANT')
    );
    const res = await ab(mockContext, mockCallback);
    expect(res).toStrictEqual([]);
    expect(mockCallback).toBeCalledWith(new Error('INVALID_VARIANT'));
  });
});
