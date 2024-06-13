import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { UnifiledResponse } from '.';

/** 自定义异常响应的格式 */
export class UnLoginException {
  message: string;

  constructor(message?: string) {
    this.message = message;
  }
}

@Catch(UnLoginException)
export class UnloginFilter implements ExceptionFilter {
  catch(exception: UnLoginException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();

    response
      .status(HttpStatus.UNAUTHORIZED)
      // .json({
      //   code: HttpStatus.UNAUTHORIZED,
      //   message: 'fail',
      //   data: exception.message || '用户未登录',
      // } satisfies UnifiledResponse<string>)
      .json({ data: exception.message || '用户未登录' })
      .end();
  }
}
