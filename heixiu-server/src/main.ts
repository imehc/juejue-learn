import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationImpl } from './helper/configuration';
import { HttpExceptionFilter } from './helper/http-exception.filter';
import { CommonExceptionFilter } from './helper/common-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, stopAtFirstError: true }),
  ); // 全局启用

  const configService = app.get(ConfigService<ConfigurationImpl>);
  // 处理其它错误响应
  app.useGlobalFilters(new CommonExceptionFilter());
  // 处理HTTP错误响应
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get('nest-server.port'));
}
bootstrap();
