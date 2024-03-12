import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';
import { CustomErrorCode } from './error-code.const';

export class S3InvalidKeyException extends CustomHttpException {
  constructor(message?: string | string[], options?: HttpExceptionOptions) {
    if (!message) {
      message = 'S3InvalidKeyException';
    }
    super(
      {
        statusCode: CustomErrorCode.S3InvalidKeyError,
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      options,
    );
  }
}
