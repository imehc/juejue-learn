import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const code = exception.getStatus();
    const res = exception.getResponse() as { message: string[] | string };
    let message = exception.message;

    if (res.message instanceof Array) {
      message = res?.message?.join('；');
    } else if (typeof res.message === 'string') {
      message = res.message;
    }

    response
      .status(code)
      // .json({
      //   code,
      //   message: 'fail',
      //   data: message,
      // } satisfies UnifiledResponse<string>)
      .send(message)
      .end();
  }
}
