import { describe, test, expect, beforeEach, vi, afterEach } from 'vitest';
import lab from '../../../lib/new';
import { Context } from '../../../lib/new/global/global.types';

const mockContext = {
  req: {
    headers: {
      cookie: '',
    },
  },
} as unknown as Context;

describe('labs', () => {
  test('test', () => {
    const original = Math.random;
    const mocked = vi.fn(() => 0.5);
    Math.random = mocked;
    const result = lab(mockContext, (err) => console.log(err));
    expect(result).toStrictEqual({
      cookies: ['abcd1234=1; ', 'xyza9876=1-0; '],
      data: {
        ab: [{ name: 'abcd1234', id: '1' }],
        mvt: [{ name: 'xyza9876', id: '1-0' }],
      },
    });
    Math.random = original;
  });
});
