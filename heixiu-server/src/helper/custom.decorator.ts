import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { JwtUserData } from './global';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  type ApiOperationOptions,
  type ApiResponseOptions,
} from '@nestjs/swagger';

// createParamDecorator 自定义参数装饰器

/** 需要登录 */
export const RequireLogin = () => SetMetadata('require-login', true);
/** 获取用户信息 */
export const UserInfo = createParamDecorator(
  (data: keyof JwtUserData, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);

type ApiDocOptions = {
  operation: ApiOperationOptions;
  /** 不需要验证 @default false */
  noBearerAuth?: boolean;
  extraModels?: Function[];
  /** @default { status: 200 } */
  response?: ApiResponseOptions;
};

/** 生成swagger文档 */
export function ApiDoc({
  operation,
  noBearerAuth = false,
  extraModels,
  response,
}: ApiDocOptions) {
  // ⚠️ 未使用dto的需要手动添加如query、params、body或者在这儿扩充
  const decorators = [
    ApiOperation(operation),
    !noBearerAuth && ApiBearerAuth(),
    !noBearerAuth && RequireLogin(),
    extraModels && ApiExtraModels(...extraModels),
    response &&
      ApiResponse({ ...response, status: response.status ?? HttpStatus.OK }),
  ];
  return applyDecorators(...decorators.filter((item) => !!item));
}
