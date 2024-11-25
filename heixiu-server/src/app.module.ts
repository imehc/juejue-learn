import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { ConfigurationImpl } from './helper/configuration';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';
import { FriendshipModule } from './friendship/friendship.module';
import { ChatroomModule } from './chatroom/chatroom.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [configuration], isGlobal: true }), // 环境配置
    // https://docs.nestjs.com/security/rate-limiting 速率限制
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // 毫秒
        limit: 3,
      },
    ]),
    PrismaModule,
    UserModule,
    RedisModule,
    EmailModule,
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService<ConfigurationImpl>) {
        return {
          secret: configService.get('jwt.access-token-secret'),
          signOptions: {
            // https://github.com/vercel/ms?tab=readme-ov-file#examples
            expiresIn: configService.get('jwt.access-token-expires-time'),
          },
        };
      },
      inject: [ConfigService],
    }),
    FriendshipModule,
    ChatroomModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaModule,
    { provide: APP_GUARD, useClass: AuthGuard }, // 全局启用Graud
    { provide: APP_GUARD, useClass: ThrottlerGuard }, 
  ],
})
export class AppModule {}
