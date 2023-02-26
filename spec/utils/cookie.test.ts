import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

import {
  type UncleanCookie,
  type ABCookie,
  getServerCookie,
  formatCookies,
  clearCookie,
  cleanCookies,
} from '../../lib/utils/cookie';

const mockName = 'MOCK_COOKIE';
const mockCookie = 'MOCK_COOKIE=abcd1234;';
const mockCookieMultiple = 'something=else; MOCK_COOKIE=abcd1234;';
const mockUncleanCookies: UncleanCookie[] = [
  null,
  undefined,
  { a: 'b' },
  { c: 'd' },
  null,
  { e: null },
  undefined,
];

const mockCleanedCookies: ABCookie[] = [{ a: 'b' }, { c: 'd' }];

describe('cookie', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('get server cookie', () => {
    const serverCookie = getServerCookie(mockName, mockCookie);
    expect(serverCookie).toBe('abcd1234');
  });

  test('get server cookie (multiple cookies)', () => {
    const serverCookie = getServerCookie(mockName, mockCookieMultiple);
    expect(serverCookie).toBe('abcd1234');
  });

  test('get server cookie (no cookie)', () => {
    const serverCookie = getServerCookie(mockName, undefined);
    expect(serverCookie).toBe(null);
  });

  test('clear cookie', () => {
    const date = new Date(2000, 1, 1, 13);
    vi.setSystemTime(date);
    const serverCookie = clearCookie(mockName);
    expect(serverCookie).toBe('MOCK_COOKIE=;Expires: 949410000000');
  });

  test('clean cookies', () => {
    const serverCookie = cleanCookies(mockUncleanCookies);
    expect(serverCookie).toStrictEqual([{ a: 'b' }, { c: 'd' }]);
  });

  test('format cookies', () => {
    const serverCookie = formatCookies(mockCleanedCookies);
    expect(serverCookie).toStrictEqual(['a=b;', 'c=d;']);
  });
});
