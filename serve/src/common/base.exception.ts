import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export class E {
  /**
   * 400 错误 - 错误的请求
   * 当请求参数有误或请求格式不正确时使用
   * @param message 错误信息
   */
  static BadRequest(message?: string) {
    throw new BadRequestException(message);
  }

  /**
   * 401 错误 - 未授权
   * 当用户未登录或token无效时使用
   * @param message 错误信息
   */
  static Unauthorized(message?: string) {
    throw new UnauthorizedException(message);
  }

  /**
   * 404 错误 - 资源未找到
   * 当请求的资源不存在时使用
   * @param message 错误信息
   */
  static NotFound(message?: string) {
    throw new NotFoundException(message);
  }

  /**
   * 422 错误 - 无法处理的实体
   * 当请求格式正确，但语义错误导致无法处理时使用
   * @param message 错误信息
   */
  static UnprocessableEntity(message?: string) {
    throw new UnprocessableEntityException(message);
  }

  /**
   * 500 错误 - 服务器内部错误
   * 当服务器发生未预期的错误时使用
   * @param message 错误信息
   */
  static InternalServerError(message?: string) {
    throw new InternalServerErrorException(message);
  }
}
