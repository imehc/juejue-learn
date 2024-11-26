import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationImpl } from './helper/configuration';
import { HttpExceptionFilter } from './helper/http-exception.filter';
import { CommonExceptionFilter } from './helper/common-exception.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';

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

  initConfig(app, configService);

  await app.listen(configService.get('nest-server.port'));
}
bootstrap();

function initConfig(
  app: INestApplication<any>,
  cs: ConfigService<ConfigurationImpl, false>,
) {
  const config = new DocumentBuilder()
    .addServer(cs.get('nest-server.doc-url'))
    .addBearerAuth({ type: 'http' })
    .addTag('auth', 'auth')
    .addTag('user', '用户')
    .addTag('friendship', '好友')
    .addTag('chatroom', '群聊')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./openapi.yaml', dump(document, {}));
  // http://localhost:6020/api
  SwaggerModule.setup('api', app, document);
  // 学习更多 https://wanago.io/2020/09/21/api-nestjs-refresh-tokens-jwt/
}
