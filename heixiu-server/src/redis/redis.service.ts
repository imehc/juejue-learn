import { Inject, Injectable, Logger } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_ClIENT } from 'src/helper/const';

@Injectable()
export class RedisService {
  @Inject(REDIS_ClIENT)
  private readonly redisClient: RedisClientType;

  private readonly logger = new Logger();

  public async get(key: string, parse?: boolean) {
    const data = await this.redisClient.get(key);
    if (parse) {
      return JSON.parse(data);
    }
    return data;
  }

  public async set(key: string, value: string | number | null, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  public async del(key: string) {
    return await this.redisClient.del(key);
  }

/**
 * 根据指定的模式删除键
 * 该方法用于删除符合给定模式的所有键，通常用于清理或重置存储空间
 * @param pattern 指定的模式，例如以某个特定前缀开始的键名
 */
public async delByPattern(pattern: string) {
  try {
    // 使用async for...of循环遍历所有匹配的键
    for await (const key of this.scanKeys(pattern)) {
      // 检查键是否为字符串类型，确保其有效性
      if (typeof key === 'string') {
        // 异步删除每个匹配的键
        await this.redisClient.del(key);
      }
    }
  } catch (error) {
    // 捕获并记录任何发生的错误
    this.logger.error(error, RedisService);
  }
}

  /**
   * 异步生成器函数，用于扫描Redis中匹配指定模式的键
   *
   * 此函数使用Redis的scan命令来迭代获取匹配给定模式的所有键它以异步方式执行，
   * 每次从Redis中扫描一部分键，直到所有匹配的键都被获取完这个过程中，
   * 函数会yield每个匹配的键，使得调用者可以通过异步迭代器逐个处理这些键
   *
   * @param pattern 指定的键模式，用于匹配键名
   * @yields 逐个产出匹配指定模式的键名
   */
  private async *scanKeys(pattern: string): AsyncGenerator<string> {
    // 初始化游标为0，表示从头开始扫描
    let cursor = 0;
    // 每次扫描返回的键数，设置为10
    const scanCount = 10;
    // 开始执行scan命令，直到游标再次变为0，表示扫描完成
    do {
      // 使用 scan 命令找到匹配的键
      const { keys, cursor: nextCursor } = await this.redisClient.scan(cursor, {
        MATCH: `${pattern}*`,
        COUNT: scanCount,
      });
      // 更新游标值为下一次扫描的起始点
      cursor = Number(nextCursor);
      // 遍历扫描得到的键，逐个yield出去
      for (const key of keys) {
        yield key;
      }
    } while (cursor !== 0);
  }
}
