import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import { Transform } from 'class-transformer';
import * as crypto from 'crypto';

/** md5加密 */
export function md5(str: string) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex'); // 返回散列值
}

/** 格式化数字 */
export function generateParseIntPipe(name: string) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该为数字');
    },
  });
}
