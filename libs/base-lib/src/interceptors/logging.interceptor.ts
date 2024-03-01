import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const now = Date.now();
    const { query, body, headers, url, method } = request;
    const handler = `${context.getClass().name}.${context.getHandler().name}`;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { authorization, ...restHeaders } = headers;
    Logger.log(
      {
        message: `Request start, ${method}: ${url}`,
        query,
        body,
        headers: restHeaders,
        handler,
      },
      LoggingInterceptor.name,
    );
    return next.handle().pipe(
      tap(() =>
        Logger.log(
          {
            message: `Request finished, ${method}: ${url}`,
            handler,
            cost: `${Date.now() - now}ms`,
          },
          LoggingInterceptor.name,
        ),
      ),
    );
  }
}
