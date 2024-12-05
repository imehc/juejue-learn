import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './helper/configuration';
import { APP_GUARD } from '@nestjs/core';
import { FriendshipModule } from './friendship/friendship.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }), // 环境配置
    // https://docs.nestjs.com/security/rate-limiting 速率限制
    ThrottlerModule.forRoot([
      {
        ttl: 1000, // 毫秒
        limit: 3,
      },
    ]),
    PrismaModule,
    UserModule,
    RedisModule,
    EmailModule,
    FriendshipModule,
    ChatroomModule,
    AuthModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    TaskModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaModule,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
