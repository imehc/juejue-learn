import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class OtherExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const code = exception.getStatus?.() || HttpStatus.INTERNAL_SERVER_ERROR;

    response
      .status(code)
      .json({
        code: code,
        type: exception.name || 'INTERNAL_SERVER_ERROR',
        message: exception.message,
      } satisfies ErrorBody)
      .end();
  }
}
