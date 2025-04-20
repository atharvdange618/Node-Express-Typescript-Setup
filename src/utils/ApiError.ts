interface ApiErrorResponse {
  success: false;
  error: {
    code: number;
    message: string;
    details?: any[];
  };
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly details?: any[];

  constructor(statusCode: number, message: string, details?: any[]) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }

  toJSON(): ApiErrorResponse {
    return {
      success: false,
      error: {
        code: this.statusCode,
        message: this.message,
        ...(this.details && { details: this.details }),
      },
    };
  }
}
