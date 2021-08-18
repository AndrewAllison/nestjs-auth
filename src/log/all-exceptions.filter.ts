import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { LogService } from './log.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new LogService('GlobalException');

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    this.logger.error(exception, `Error ${exception.message}`, exception);

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const pathName =
      (ctx as any).contextType === 'graphql'
        ? (ctx as any)?.args[(ctx as any)?.args?.length]?.fieldName ||
          'graphqlMethod'
        : request?.url;

    if (typeof response.status === 'function') {
      const errorObject = (exception as any).response || {
        statusCode: 500,
        error: 'Server Exception',
        message: [(exception as HttpException).message],
      };

      return response.status(status).json({
        timestamp: new Date().toISOString(),
        path: pathName,
        error: errorObject,
      });
    } else {
      throw exception;
    }
  }
}
