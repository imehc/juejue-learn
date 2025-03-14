import { Inject, Injectable } from '@nestjs/common';
import { PROVIDER } from 'global/constant';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject(PROVIDER.REDIS)
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
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
