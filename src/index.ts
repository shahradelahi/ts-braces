import { BraceLimitError } from './errors';
import type { MaxBraceExpansion, RangePattern } from './typings';

export * from './errors';
export * from './typings';

/**
 * Compiles a numeric range into a highly compact and optimized regular expression pattern.
 *
 * This function optimizes the range by partitioning it into sub-ranges (e.g., individual digits,
 * tens, hundreds) and combining them using regular expression character classes and quantifiers.
 * The generated pattern is V8-safe and ideal for high-performance route matching or input validation.
 *
 * @param start - The starting number of the range (inclusive).
 * @param end - The ending number of the range (inclusive).
 * @returns A compact regular expression pattern matching any number within the specified range.
 *
 * @example
 * ```typescript
 * import { compileNumericRange } from '@se-oss/braces';
 *
 * const pattern = compileNumericRange(1, 250);
 * // returns: "[1-9]|[1-9]\d|1\d{2}|2[0-4]\d|250"
 *
 * const regex = new RegExp(`^(?:${pattern})$`);
 * regex.test('123'); // true
 * regex.test('251'); // false
 * ```
 */
export function compileNumericRange(start: number, end: number): string {
  if (start > end) {
    return compileNumericRange(end, start);
  }

  const matches: string[] = [];

  function partition(min: number, max: number): void {
    if (min > max) return;

    if (min.toString().length < max.toString().length) {
      const nextPower = Math.pow(10, min.toString().length);
      partition(min, nextPower - 1);
      partition(nextPower, max);
      return;
    }

    const len = min.toString().length;
    if (len === 1) {
      matches.push(`[${min}-${max}]`);
      return;
    }

    const div = Math.pow(10, len - 1);
    const minDigit = Math.floor(min / div);
    const maxDigit = Math.floor(max / div);

    if (minDigit === maxDigit) {
      const minRemainder = min % div;
      const maxRemainder = max % div;
      matches.push(`${minDigit}(?:${compileNumericRange(minRemainder, maxRemainder)})`);
    } else {
      const firstLimit = (minDigit + 1) * div - 1;
      partition(min, firstLimit);

      if (minDigit + 1 < maxDigit) {
        const middleDigitMin = minDigit + 1;
        const middleDigitMax = maxDigit - 1;
        matches.push(`[${middleDigitMin}-${middleDigitMax}]\\d{${len - 1}}`);
      }

      const lastLimit = maxDigit * div;
      partition(lastLimit, max);
    }
  }

  partition(start, end);
  return matches.join('|');
}

/**
 * Expands a range string (numeric or alphanumeric) into an array of its constituent elements.
 *
 * Supports numeric ranges (e.g. "1..5") with padding preservation (e.g. "01..03" -> ["01", "02", "03"]),
 * alphabetical ranges (e.g. "a..c"), and custom steps (e.g. "1..5..2" -> ["1", "3", "5"]).
 *
 * If the range size exceeds the maximum brace expansion threshold, it will throw a `BraceLimitError`.
 *
 * @param rangeStr - The range pattern to expand.
 * @param maxBraceExpansion - The maximum number of allowed elements in the expanded output. Defaults to 10000.
 * @returns An array of string elements representing the fully expanded range.
 * @throws {BraceLimitError} If the size of the expanded range exceeds the specified `maxBraceExpansion` limit.
 *
 * @example
 * ```typescript
 * import { expandRange } from '@se-oss/braces';
 *
 * // Numeric expansion
 * expandRange('1..3'); // ['1', '2', '3']
 *
 * // Preserves padding
 * expandRange('01..03'); // ['01', '02', '03']
 *
 * // Alphabetical expansion with step
 * expandRange('a..e..2'); // ['a', 'c', 'e']
 *
 * // Throw error when limit is exceeded
 * expandRange('1..10000', 10); // Throws BraceLimitError
 * ```
 */
export function expandRange(
  rangeStr: RangePattern,
  maxBraceExpansion: MaxBraceExpansion = 10000
): string[] {
  const parts = rangeStr.split('..');
  if (parts.length < 2) return [rangeStr];

  const startStr = parts[0]!;
  const endStr = parts[1]!;
  const stepStr = parts[2];
  const step = stepStr ? parseInt(stepStr, 10) : 1;

  if (isNaN(step) || step <= 0) {
    return [rangeStr];
  }

  const isNumeric = /^-?\d+$/.test(startStr) && /^-?\d+$/.test(endStr);
  if (isNumeric) {
    const start = parseInt(startStr, 10);
    const end = parseInt(endStr, 10);
    const count = Math.ceil((Math.abs(end - start) + 1) / step);
    if (count > maxBraceExpansion) {
      throw new BraceLimitError('Brace range too large.');
    }
    const isPadded = startStr.startsWith('0') && startStr.length > 1;
    const padLength = isPadded ? startStr.length : 0;

    const result: string[] = [];
    const increment = start <= end ? step : -step;

    let current = start;
    while (start <= end ? current <= end : current >= end) {
      let val = current.toString();
      if (padLength > 0 && current >= 0) {
        val = val.padStart(padLength, '0');
      }
      result.push(val);
      current += increment;
    }
    return result;
  }

  if (startStr.length === 1 && endStr.length === 1) {
    const start = startStr.charCodeAt(0);
    const end = endStr.charCodeAt(0);
    const count = Math.ceil((Math.abs(end - start) + 1) / step);
    if (count > maxBraceExpansion) {
      throw new BraceLimitError('Brace range too large.');
    }

    const result: string[] = [];
    const increment = start <= end ? step : -step;

    let current = start;
    while (start <= end ? current <= end : current >= end) {
      result.push(String.fromCharCode(current));
      current += increment;
    }
    return result;
  }

  return [rangeStr];
}
