import chalk from 'chalk';

export class BaseResponse<T = any> {
  public success: boolean;
  public status: number;
  public message: string;
  public data?: T;

  constructor(message: string, data?: T, status: number = 200) {
    this.success = true;
    this.status = status;
    this.message = message;
    this.data = data;
    console.log(chalk.green(`[SUCCESS] ${this.status} - ${this.message}`));
  }

  static Success<T>(message: string, data?: T, status: number = 200) {
    return new BaseResponse<T>(message, data, status);
  }

  static Created<T>(message: string, data?: T) {
    return new BaseResponse<T>(message, data, 201);
  }

  static NoContent(message: string = "No Content") {
    return new BaseResponse(message, undefined, 204);
  }
}
