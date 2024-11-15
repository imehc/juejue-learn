import * as crypto from 'crypto';

export function md5(str: string) {
  const hash = crypto.createHash('md5'); // 创建一个md5加密方法
  hash.update(str); // 传入要加密的字符串
  return hash.digest('hex'); // 返回加密后的字符串
}
