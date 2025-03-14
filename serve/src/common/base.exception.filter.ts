import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import {
  I18nValidationException,
  I18nValidationExceptionFilter,
} from 'nestjs-i18n';

@Catch(HttpException)
export class BaseExceptionFilter extends I18nValidationExceptionFilter {
  constructor() {
    super();
  }

  protected buildResponseBody(
    host: ArgumentsHost,
    exc: I18nValidationException,
  ) {
    const code = exc.getStatus() || HttpStatus.BAD_REQUEST;
    return {
      code: code,
      type: exc.name,
      message: exc.message,
      details: exc?.errors?.map((error) => ({
        field: error.property,
        messages: Object.values(error.constraints || {}),
      })),
    } satisfies ErrorBody;
  }
}
