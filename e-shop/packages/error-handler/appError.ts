class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details: any;

  constructor(
    message: string,
    statusCode: number,
    isOperational = true,
    details?: any
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;

    // Set the prototype explicitly.
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resources not found ") {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Validation error", details?: any) {
    super(message, 422, true, details);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, 409);
  }
}

export class DatabaseError extends AppError {
  constructor(message = "Database error", details?: any) {
    super(message, 500, false, details);
  }
}

export class RateLimitError extends AppError {
  constructor(message = "Rate limit exceeded") {
    super(message, 429);
  }
}

export default AppError;
