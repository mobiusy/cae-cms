import { HttpExceptionOptions, HttpStatus } from '@nestjs/common';
import { CustomHttpException } from './custom-http-exception';
import { CustomErrorCode } from './error-code.const';

export class S3Exception extends CustomHttpException {
  constructor(message: string | string[], options?: HttpExceptionOptions) {
    super(
      {
        statusCode: CustomErrorCode.S3ServiceError,
        message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
      options,
    );
  }
}
