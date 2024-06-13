import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const code = exception.getStatus();
    response.statusCode = code;

    const res = exception.getResponse() as { message: string[] | string };
    let message = exception.message;

    if (res.message instanceof Array) {
      message = res?.message?.join('；');
    } else {
      message = res.message;
    }

    response
      .status(code)
      // .json({
      //   code,
      //   message: 'fail',
      //   data: message,
      // } satisfies UnifiledResponse<string>)
      .send(message ?? res.message ?? res)
      .end();
  }
}
