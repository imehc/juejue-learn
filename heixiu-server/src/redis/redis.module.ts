import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { REDIS_ClIENT } from 'src/config/const';
import { createClient } from 'redis';
import { ConfigService } from '@nestjs/config';
import { ConfigurationImpl } from 'src/config/configuration';

@Global() // 声明为全局模块
@Module({
  providers: [
    RedisService,
    {
      provide: REDIS_ClIENT,
      async useFactory(configService: ConfigService<ConfigurationImpl>) {
        const client = createClient({
          socket: {
            host: configService.get('redis-server.host'),
            port: configService.get('redis-server.port'),
          },
          database: configService.get('redis-server.db'),
        });
        await client.connect();
        return client;
      },
      inject: [ConfigService], // 需要在此注入，否则useFactory无法获取
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
