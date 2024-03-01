import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { FeedbackDto } from '../dto/feedback.dto';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): any {
    return next.handle().pipe(
      map((result): FeedbackDto => {
        return {
          code: 200,
          success: true,
          timestamp: new Date().toISOString(),
          data: result,
          msg: context.getHandler().name,
        };
      }),
    );
  }
}
