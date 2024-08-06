import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 全局启用校验请求体的参数
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 转换为 dto 实例, 默认为普通对象
    }),
  );

  await app.listen(6020);
}
bootstrap();
