/**
 * Base error class for all brace-related errors.
 */
export class BraceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BraceError';
  }
}

/**
 * Error thrown when a range expansion exceeds the specified maximum expansion limit.
 */
export class BraceLimitError extends BraceError {
  constructor(message: string) {
    super(message);
    this.name = 'BraceLimitError';
  }
}
