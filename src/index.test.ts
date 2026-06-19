import { describe, expect, it } from 'vitest';

import { BraceLimitError, compileNumericRange, expandRange } from './index';

describe('V8-Safe Numeric Range Optimizer (compileNumericRange)', () => {
  it('should optimize and compile numeric ranges into compact digit patterns', () => {
    const pattern = compileNumericRange(1, 250);
    const regex = new RegExp(`^(?:${pattern})$`);
    expect(regex.test('1')).toBe(true);
    expect(regex.test('99')).toBe(true);
    expect(regex.test('250')).toBe(true);
    expect(regex.test('251')).toBe(false);
    expect(regex.test('0')).toBe(false);
  });
});

describe('Range Expander (expandRange)', () => {
  it('should expand numeric ranges', () => {
    expect(expandRange('1..3')).toEqual(['1', '2', '3']);
    expect(expandRange('01..03')).toEqual(['01', '02', '03']);
  });

  it('should expand alphabetical ranges', () => {
    expect(expandRange('a..c')).toEqual(['a', 'b', 'c']);
  });

  it('should support step parameters', () => {
    expect(expandRange('1..5..2')).toEqual(['1', '3', '5']);
  });

  it('should throw BraceLimitError for too large ranges', () => {
    expect(() => expandRange('1..10000', 10)).toThrow(BraceLimitError);
  });
});
