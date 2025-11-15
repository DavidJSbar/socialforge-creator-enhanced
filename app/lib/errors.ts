/**
 * Custom error classes for better error handling across the application
 */

/**
 * Base application error class
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Authentication and authorization errors
 */
export class AuthError extends AppError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTH_ERROR');
  }
}

/**
 * Validation errors for user input
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public fields?: Record<string, string>
  ) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

/**
 * Not found errors
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

/**
 * Rate limit errors
 */
export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded') {
    super(message, 429, 'RATE_LIMIT_ERROR');
  }
}

/**
 * External API errors
 */
export class ExternalAPIError extends AppError {
  constructor(
    message: string,
    public platform?: string
  ) {
    super(message, 502, 'EXTERNAL_API_ERROR');
  }
}

/**
 * Database errors
 */
export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500, 'DATABASE_ERROR');
  }
}

/**
 * Error handler for API routes
 */
export function handleAPIError(error: unknown): {
  error: string;
  code?: string;
  statusCode: number;
  fields?: Record<string, string>;
} {
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
      ...(error instanceof ValidationError && { fields: error.fields }),
    };
  }

  if (error instanceof Error) {
    console.error('Unexpected error:', error);
    return {
      error: error.message,
      statusCode: 500,
    };
  }

  console.error('Unknown error:', error);
  return {
    error: 'An unexpected error occurred',
    statusCode: 500,
  };
}
