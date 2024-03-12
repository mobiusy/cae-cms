import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';
import { CustomErrorCode } from './error-code.const';

export class PvNotFoundException extends CustomHttpException {
  constructor(message?: string | string[], options?: HttpExceptionOptions) {
    if (!message) {
      message = 'Pv not found';
    }
    super(
      {
        statusCode: CustomErrorCode.StatisticPvNotFoundError,
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      options,
    );
  }
}
