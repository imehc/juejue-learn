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
import { NestExpressApplication } from '@nestjs/platform-express';
import path from 'path';
import { utilities, WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        initLog({ init: true }),
        initLog({ level: 'error' }),
        initLog({ level: 'warn' }),
      ],
    }),
  });
  app.useGlobalPipes(
    new ValidationPipe({ transform: true, stopAtFirstError: true }),
  ); // 全局启用

  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  }); // 设置目录为静态文件目录

  const configService = app.get(ConfigService<ConfigurationImpl>);
  // 处理其它错误响应
  app.useGlobalFilters(new CommonExceptionFilter());
  // 处理HTTP错误响应
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors();

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
    .addTag('file', '文件')
    .addTag('user', '用户')
    .addTag('friendship', '好友')
    .addTag('chatroom', '群聊')
    .addTag('weather', '天气')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  writeFileSync('./openapi.yaml', dump(document, {}));
  // http://localhost:6020/api
  SwaggerModule.setup('api', app, document);
  // 学习更多 https://wanago.io/2020/09/21/api-nestjs-refresh-tokens-jwt/
}

type Level = 'error' | 'warn' | 'info' | 'http' | 'verbose' | 'debug' | 'silly';
function initLog({
  level = 'debug',
  init = false,
}: {
  level?: Level;
  init?: boolean;
}) {
  // TODO: 生产环境需要哪些日志
  if (init) {
    return new transports.Console({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.ms(),
        utilities.format.nestLike('HeiXiu', {
          colors: true,
          prettyPrint: true,
          processId: true,
          appName: true,
        }),
      ),
    });
  }
  return new transports.DailyRotateFile({
    format: format.combine(
      format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      format.ms(),
      utilities.format.nestLike('HeiXiu', {
        colors: false,
        prettyPrint: true,
        processId: true,
        appName: true,
      }),
    ),
    frequency: '12h',
    level: level,
    dirname: 'logs',
    filename: `${level}-%DATE%.log`,
    maxSize: '2M',
  });
}
