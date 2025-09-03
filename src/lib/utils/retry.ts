/**
 * Utility function to retry async operations with exponential backoff
 */

export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
  backoffFactor?: number;
}

export interface RetryError extends Error {
  isRetryError: true;
  attempts: number;
  lastError: Error;
}

/**
 * Creates a retry error with metadata about the retry attempts
 */
export const createRetryError = (lastError: Error, attempts: number): RetryError => {
  const error = new Error(`Failed after ${attempts} attempts. Last error: ${lastError.message}`) as RetryError;
  error.name = 'RetryError';
  error.isRetryError = true;
  error.attempts = attempts;
  error.lastError = lastError;
  return error;
};

/**
 * Checks if an error is a retry error
 */
export const isRetryError = (error: Error): error is RetryError => {
  return (error as RetryError).isRetryError === true;
};

/**
 * Delays execution for the specified number of milliseconds
 */
const delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculates the delay for the next retry attempt using exponential backoff
 */
const calculateDelay = (attempt: number, baseDelay: number, maxDelay: number, backoffFactor: number): number => {
  const calculatedDelay = baseDelay * Math.pow(backoffFactor, attempt - 1);
  return Math.min(calculatedDelay, maxDelay);
};

/**
 * Retries an async operation with exponential backoff
 * 
 * @param operation - The async operation to retry
 * @param options - Retry configuration options
 * @returns Promise that resolves with the operation result or rejects with a RetryError
 */
export const withRetry = async <T>(
  operation: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> => {
  const {
    maxAttempts = 3,
    baseDelay = 1000, // 1 second
    maxDelay = 10000, // 10 seconds
    backoffFactor = 2
  } = options;

  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error as Error;

      // If this is the last attempt, don't wait and throw the retry error
      if (attempt === maxAttempts) {
        throw createRetryError(lastError, attempt);
      }

      // Calculate delay for next attempt
      const delayMs = calculateDelay(attempt, baseDelay, maxDelay, backoffFactor);

      // Log the retry attempt (optional, can be removed in production)
      console.warn(`Attempt ${attempt} failed, retrying in ${delayMs}ms...`, lastError.message);

      // Wait before next attempt
      await delay(delayMs);
    }
  }

  // This should never be reached, but TypeScript requires it
  throw createRetryError(lastError, maxAttempts);
};

