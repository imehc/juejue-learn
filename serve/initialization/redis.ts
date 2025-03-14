import { Provider } from '@nestjs/common';
import { getRedisConfig } from 'config/redis.config';
import { PROVIDER } from 'global/constant';
import { createClient } from 'redis';

export const LoadRedis: Provider = {
  provide: PROVIDER.REDIS,
  async useFactory() {
    const redisConfig = getRedisConfig();
    const client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
      database: redisConfig.db,
      password: redisConfig.password,
    });
    await client.connect();
    return client;
  },
};
