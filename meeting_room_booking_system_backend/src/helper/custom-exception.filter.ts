import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { UnifiledResponse } from '.';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const code = exception.getStatus()
    response.statusCode = code;

    const res = exception.getResponse() as { message: string[] };
    let message = exception.message;
    try {
      message = res?.message?.join('；')
    } catch (error) {
      // 
    }

    response
      // .status(code)
      .json({
        code,
        message: 'fail',
        data: message,
      } satisfies UnifiledResponse<string>)
      .end();
  }
}
