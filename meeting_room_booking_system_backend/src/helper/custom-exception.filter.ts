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
    // message 由下面的三元直接算出，不再先赋 exception.message 再覆盖
    const message = Array.isArray(res.message)
      ? res.message.join('；')
      : res.message;

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
