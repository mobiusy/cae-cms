import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export interface StandardResponse {
  /** 错误码 */
  statusCode: number;

  /** 错误消息 */
  message: string | string[];
}

export class CustomHttpException extends HttpException {
  constructor(
    response: StandardResponse,
    status: number,
    options?: HttpExceptionOptions,
  ) {
    super(response, status, options);
  }
}
