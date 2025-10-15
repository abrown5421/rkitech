import chalk from 'chalk';

export class BaseError extends Error {
  public status: number;
  public details?: any;

  constructor(message: string, status: number = 500, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype); 
    Error.captureStackTrace(this);
    console.error(chalk.red(`[ERROR] ${this.status} - ${this.message}`));
    if (this.details) console.error(chalk.red(`Details: ${JSON.stringify(this.details)}`));
  }

  static NotFound(resource: string, id?: string) {
    return new BaseError(
      id ? `No ${resource} found with ID: ${id}` : `${resource} not found`,
      404
    );
  }

  static Validation(message: string, details?: any) {
    return new BaseError(message, 400, details);
  }

  static Unauthorized(message = "Unauthorized") {
    return new BaseError(message, 401);
  }

  static Forbidden(message = "Forbidden") {
    return new BaseError(message, 403);
  }
}
