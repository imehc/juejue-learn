import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'src/redis/redis.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import configuration, { ConfigurationImpl } from 'src/helper/configuration';
import { RedisService } from 'src/redis/redis.service';
import { JwtUserData } from 'src/helper/global';
import { jwtRefreshWrapper, jwtWrapper } from 'src/helper/helper';
import { BadRequestException } from '@nestjs/common';
import { testByUser } from './auth.test';

describe('AuthService', () => {
  let auth: AuthService;
  let jwt: JwtService;
  let redis: RedisService;
  let config: ConfigService<ConfigurationImpl>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        JwtModule.register({}),
        RedisModule,
        PrismaModule,
      ],
      providers: [AuthService],
    }).compile();

    auth = module.get<AuthService>(AuthService);
    jwt = module.get<JwtService>(JwtService);
    redis = module.get<RedisService>(RedisService);
    config = module.get<ConfigService>(ConfigService);
  });

  test('Test the robustness of token', async () => {
    jest.useFakeTimers({ advanceTimers: true });
    const token = await auth.getTokens(testByUser.id, testByUser.username);
    // 返回结构
    expect(token).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      expiresIn: expect.any(Number),
    });

    type JWTData = JwtUserData & { exp: number };
    // 解析accessToken
    const data = await jwt.verifyAsync<JWTData>(token.accessToken, {
      secret: config.get('jwt.access-token-secret'),
    });
    // 获取对应的过期时间
    const cacheExp = await redis.get(jwtWrapper(data.userId));
    // 解析刷新token
    const rData = await jwt.verifyAsync<JWTData>(token.refreshToken, {
      secret: config.get('jwt.refresh-token-secret'),
    });
    // 获取刷新token对应的过期时间
    const rCacheExp = await redis.get(jwtRefreshWrapper(data.userId));

    // token过期时间一致
    expect(data.exp.toString()).toEqual(cacheExp);
    // 刷新token过期时间一致
    expect(rData.exp.toString()).toEqual(rCacheExp);

    //  经过一段时间获取新的token
    jest.advanceTimersByTime(1000);
    // 测试颁发新的token原token失效
    // 获取新的token
    const nToken = await auth.getTokens(testByUser.id, testByUser.username);
    // 解析新的accessToken
    const nData = await jwt.verifyAsync<JWTData>(nToken.accessToken, {
      secret: config.get('jwt.access-token-secret'),
    });
    // 获取新的token对应的过期时间
    const nCacheExp = await redis.get(jwtWrapper(data.userId));
    // 解析新的refreshToken
    const nRData = await jwt.verifyAsync<JWTData>(nToken.refreshToken, {
      secret: config.get('jwt.refresh-token-secret'),
    });
    // 获取新的refreshToken对应的过期时间
    const nRCacheExp = await redis.get(jwtRefreshWrapper(data.userId));

    // 缓存的过期时间不会是旧token过期时间，从而使旧token失效
    expect(nCacheExp).not.toEqual(data.exp.toString());
    expect(nCacheExp).toEqual(nData.exp.toString());
    // 刷新token同理
    expect(nRCacheExp).not.toEqual(rData.exp.toString());
    expect(nRCacheExp).toEqual(nRData.exp.toString());

    //  经过一段时间使用refreshToken换取新的token
    jest.advanceTimersByTime(1000);

    // 使用refreshToken获取新的token
    // 使用accessToken 会抛出错误
    await expect(auth.refreshToken(token.accessToken, true)).rejects.toThrow(
      new BadRequestException('refreshToken无效'),
    );
    // 使用旧的refreshToken也会抛出错误
    await expect(auth.refreshToken(token.refreshToken, true)).rejects.toThrow(
      new BadRequestException('refreshToken无效'),
    );
    // 使用新的refreshToken会返回生成最新的token
    const nToken2 = await auth.refreshToken(nToken.refreshToken, true);
    expect(nToken2).toMatchObject({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
      expiresIn: expect.any(Number),
    });
    // 测试生成新的是否有效
    const n2data = await jwt.verifyAsync<JWTData>(nToken2.accessToken, {
      secret: config.get('jwt.access-token-secret'),
    });
    // 获取对应的过期时间
    const n2cacheExp = await redis.get(jwtWrapper(n2data.userId));
    // 解析刷新token
    const n2RData = await jwt.verifyAsync<JWTData>(nToken2.refreshToken, {
      secret: config.get('jwt.refresh-token-secret'),
    });
    // 获取刷新token对应的过期时间
    const n2RCacheExp = await redis.get(jwtRefreshWrapper(n2RData.userId));

    // token过期时间一致
    expect(n2data.exp.toString()).toEqual(n2cacheExp);
    // 刷新token过期时间一致
    expect(n2RData.exp.toString()).toEqual(n2RCacheExp);
  });
});
