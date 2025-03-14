import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { LoadTypeOrm } from 'initialization/typeorm';
import { LoadI18n } from 'initialization/i18n';
import { UserModule } from './user/user.module';

@Module({
  imports: [LoadTypeOrm, RedisModule, LoadI18n, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
