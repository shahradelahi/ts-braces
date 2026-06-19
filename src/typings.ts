/**
 * A string representation of a range pattern, formatted as 'start..end' or 'start..end..step'.
 *
 * @example
 * ```typescript
 * const numericRange: RangePattern = '1..5';
 * const steppedAlphaRange: RangePattern = 'a..e..2';
 * ```
 */
export type RangePattern = string;

/**
 * The maximum number of elements allowed in an expanded range.
 */
export type MaxBraceExpansion = number;

/**
 * The step interval for the range expansion.
 */
export type ExpansionStep = number;
