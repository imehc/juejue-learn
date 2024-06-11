import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiCode } from './api.code.enum';

type StatusCode = ApiCode | HttpStatus;

export class ApiException extends HttpException {
  private msg: string;
  private code: StatusCode;

  /**
   *自定义错误码处理
   * @param msg 错误消息
   * @param code 错误码
   * @param statuscode http 错误码，默认500
   */
  constructor(
    msg: string,
    code: StatusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(msg, code);

    this.msg = msg;
    this.code = code;
  }

  getErrorCode(): typeof this.code {
    return this.code;
  }

  getErrorMsg(): typeof this.msg {
    return this.msg;
  }
}
