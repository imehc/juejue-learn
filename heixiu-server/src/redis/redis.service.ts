import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_ClIENT } from 'src/helper/const';

@Injectable()
export class RedisService {
  @Inject(REDIS_ClIENT)
  private readonly redisClient: RedisClientType;

  public async get(key: string) {
    return await this.redisClient.get(key);
  }

  public async set(key: string, value: string | null, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }

  public async del(key: string) {
    return await this.redisClient.del(key);
  }
}
