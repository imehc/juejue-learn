import { applyDecorators } from '@nestjs/common';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  Min,
  Matches,
} from 'class-validator';
import { CommonI18n } from './common.i18n';
import { emailRegex, phoneRegex } from 'utils/regex';

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

/**
 * 手机号码验证装饰器
 * 支持的号段格式：
 * - 13x xxxx xxxx
 * - 14[5-9] xxxx xxxx
 * - 15[0-35-9] xxxx xxxx
 * - 16[567] xxxx xxxx
 * - 17[0-8] xxxx xxxx
 * - 18x xxxx xxxx
 * - 19[0-35-9] xxxx xxxx
 * @returns Decorator
 */
export function VPhoneNumber() {
  return applyDecorators(
    Matches(phoneRegex, {
      message: CommonI18n.i18n('validation.isPhoneNumber'),
    }),
  );
}

/**
 * 邮箱格式验证装饰器
 * 验证字段必须是有效的电子邮件地址格式
 * 支持的格式：
 * - 本地部分可以包含字母、数字、点号、下划线和连字符
 * - 域名部分必须包含有效的顶级域名
 * - 示例：user.name@example.com
 * @returns Decorator
 */
export function VEmail() {
  return applyDecorators(
    Matches(emailRegex, {
      message: CommonI18n.i18n('validation.isEmail'),
    }),
  );
}
