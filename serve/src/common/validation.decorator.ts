import { applyDecorators } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';
import { CommonI18n } from './common.i18n';

/**
 * 必填验证装饰器
 * 验证字段不能为空
 * @returns Decorator
 */
export function VRequired() {
  return applyDecorators(
    IsNotEmpty({ message: CommonI18n.i18n('validation.isNotEmpty') }),
  );
}

/**
 * 字符串验证装饰器
 * 验证字段必须是字符串类型
 * @returns Decorator
 */
export function VString() {
  return applyDecorators(
    IsString({ message: CommonI18n.i18n('validation.isString') }),
  );
}

/**
 * 数字验证装饰器
 * 验证字段必须是数字类型，可选设置最大值和最小值
 * @param max - 可选，最大值
 * @param min - 可选，最小值
 * @returns Decorator
 */
export function VNumber({ max, min }: { max?: number; min?: number }) {
  const decorators = [
    IsNumber({}, { message: CommonI18n.i18n('validation.isNumber') }),
  ];
  if (max) {
    decorators.push(Max(max, { message: CommonI18n.i18n('validation.max') }));
  }
  if (min) {
    decorators.push(Min(min, { message: CommonI18n.i18n('validation.min') }));
  }
  return applyDecorators(...decorators);
}
