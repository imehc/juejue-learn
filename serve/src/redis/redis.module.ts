import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { LoadRedis } from 'initialization/redis';

@Global()
@Module({
  providers: [RedisService, LoadRedis],
  exports: [RedisService],
})
export class RedisModule {}
