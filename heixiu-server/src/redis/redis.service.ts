import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';
import { REDIS_ClIENT } from 'src/config/const';

@Injectable()
export class RedisService {
  @Inject(REDIS_ClIENT)
  private redisClient: RedisClientType;

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async set(key: string, value: string | null, ttl?: number) {
    await this.redisClient.set(key, value);
    if (ttl) {
      await this.redisClient.expire(key, ttl);
    }
  }
  
  async del(key: string){
    return await this.redisClient.del(key);
  }
}
