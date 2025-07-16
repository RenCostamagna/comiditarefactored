export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    
    // Maintain proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

export class ValidationError extends AppError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400)
    this.name = 'ValidationError'
    this.field = field
  }
  
  field?: string
}

export class NetworkError extends AppError {
  constructor(message: string = 'Network error occurred') {
    super(message, 'NETWORK_ERROR', 503)
    this.name = 'NetworkError'
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404)
    this.name = 'NotFoundError'
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized access') {
    super(message, 'UNAUTHORIZED', 401)
    this.name = 'UnauthorizedError'
  }
}

// Error handling utility functions
export function handleError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }
  
  if (error instanceof Error) {
    return new AppError(error.message, 'UNKNOWN_ERROR', 500, false)
  }
  
  return new AppError('An unexpected error occurred', 'UNKNOWN_ERROR', 500, false)
}

export function logError(error: AppError, context?: string): void {
  const errorInfo = {
    name: error.name,
    message: error.message,
    code: error.code,
    statusCode: error.statusCode,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  }
  
  console.error('Application Error:', errorInfo)
  
  // In production, you might want to send this to a logging service
  // Example: sendToLoggingService(errorInfo)
}

export function createErrorHandler<T>(
  fallback: T,
  context?: string
) {
  return (error: unknown): T => {
    const appError = handleError(error)
    logError(appError, context)
    return fallback
  }
}

// API error handling
export async function handleApiError(response: Response): Promise<never> {
  const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
  
  switch (response.status) {
    case 400:
      throw new ValidationError(errorData.message || 'Invalid request')
    case 401:
      throw new UnauthorizedError(errorData.message)
    case 404:
      throw new NotFoundError(errorData.message || 'Resource')
    case 503:
      throw new NetworkError(errorData.message)
    default:
      throw new AppError(
        errorData.message || 'Server error',
        'SERVER_ERROR',
        response.status
      )
  }
}

// Async wrapper with error handling
export async function withErrorHandling<T>(
  asyncFn: () => Promise<T>,
  fallback?: T,
  context?: string
): Promise<T | undefined> {
  try {
    return await asyncFn()
  } catch (error) {
    const appError = handleError(error)
    logError(appError, context)
    return fallback
  }
}

// React component error boundary helpers
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message
  }
  
  if (error instanceof Error) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

export function shouldRetry(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.code === 'NETWORK_ERROR' || error.statusCode >= 500
  }
  return false
}