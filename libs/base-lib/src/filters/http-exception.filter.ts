import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { FeedbackDto } from '../dto/feedback.dto';
import { Request, Response } from 'express';
import { inspect } from 'util';
import { Prisma } from '@prisma/client';
import { CustomHttpException, StandardResponse } from '../errors';
import { isArray, isString } from 'class-validator';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(error: unknown, host: ArgumentsHost): void {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    if (error instanceof ServiceUnavailableException) {
      return httpAdapter.reply(
        response,
        error.getResponse(),
        error.getStatus(),
      );
    }

    // http响应code
    const httpStatus =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    // 错误代码
    let resCode = httpStatus;
    let msg: string | string[] = '';
    if (error instanceof CustomHttpException) {
      const res = error.getResponse() as StandardResponse;
      msg = res.message;
      resCode = res.statusCode;
    } else if (error instanceof HttpException) {
      const customRes = error.getResponse();
      
      if (isString(customRes) || isArray<string>(customRes)) {
        msg = customRes;
      } else {
        msg = JSON.stringify(customRes);
      }
    } else if (error instanceof Error) {
      msg = error.message;
    } else {
      msg = httpAdapter.getRequestUrl(request);
    }

    const responseBody: FeedbackDto = {
      code: resCode,
      success: false,
      timestamp: new Date().toISOString(),
      msg: msg || 'Internal Server Error',
    };

    const { url, method, query, body } = request;
    this.logger.error({
      message: msg,
      url,
      method,
      query,
      body,
      exception: inspect(error),
    });

    httpAdapter.reply(response, responseBody, httpStatus);
  }
}
