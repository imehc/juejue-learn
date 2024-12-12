import base62 from 'base62';
import * as crypto from 'crypto';

/** 加密 */
export function md5(str: string) {
  const hash = crypto.createHash('md5'); // 创建一个md5加密方法
  hash.update(str); // 传入要加密的字符串
  return hash.digest('hex'); // 返回加密后的字符串
}

/**
 * 生成指定长度的随机字符串
 * 
 * 该函数通过生成随机数并将其转换为Base62编码来生成随机字符串Base62编码使用0-9、a-z、A-Z共62个字符
 * 主要用于生成唯一标识符或简短的随机代码，如短链接服务中的链接代码
 * 
 * @param len 生成随机字符串的长度
 * @returns 返回生成的随机字符串
 */
export function generateRandomStr(len: number) {
  let str = '';
  for (let i = 0; i < len; i++) {
    // 生成0到61之间的随机数，作为Base62编码的输入
    const num = Math.floor(Math.random() * 62);
    // 将生成的随机数转换为Base62编码，并拼接到结果字符串上
    str += base62.encode(num);
  }
  return str;
}

/** 不打印日志 */
export const noop =
  process.env.NODE_ENV && !['test'].includes(process.env.NODE_ENV);

export const isProduction = process.env.NODE_ENV === 'production';
export const isDevelopment = process.env.NODE_ENV === 'development';
