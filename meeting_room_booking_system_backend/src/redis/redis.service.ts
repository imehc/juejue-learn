import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  async get(key: string) {
    const result = await this.redisClient.get(key);
    return result as string;
  }

  async set(key: string, value: string | number, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      // 如果有设置过期时间
      await this.redisClient.expire(key, ttl);
    }
  }

  async del(key: string) {
    return await this.redisClient.del(key);
  }
}
