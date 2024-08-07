import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 全局启用校验请求体的参数
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // 转换为 dto 实例, 默认为普通对象
    }),
  );
  // 将uploads 目录设置为静态文件目录
  app.useStaticAssets(join(__dirname, '../uploads'), { prefix: '/uploads' });

  await app.listen(6020);
}
bootstrap();
