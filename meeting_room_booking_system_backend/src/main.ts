import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { FormatResponseInterceptor } from './helper/format-response.interceptor';
import { InvokeRecordInterceptor } from './helper/invoke-record.interceptor';
import { UnloginFilter } from './helper/unlogin.filter';
import { CustomExceptionFilter } from './helper/custom-exception.filter';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as path from 'path';
import cookieParser from 'cookie-parser';
import { ConfigurationImpl } from './config/configuration-impl';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(path.join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  }); // 设置目录为静态文件目录

  // 全局启用
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new UnloginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());

  app.use(cookieParser());

  const configService = app.get(ConfigService<ConfigurationImpl>);
  initConfig(app, configService);

  // winston 的 logger 设置为 Nest 的默认 Logger
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen(configService.get('nest-server.port'));
}
bootstrap();

function initConfig(
  app: INestApplication<any>,
  cs: ConfigService<ConfigurationImpl, false>,
) {
  // 减少模版代码参考 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addServer(cs.get('nest-server.doc-url'))
    .addBearerAuth({ type: 'http', description: '基于jwt的认证' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 写入到文件
  writeFileSync('./openapi.yaml', dump(document, {}));
  // http://localhost:6020/api-doc
  SwaggerModule.setup('api-doc', app, document);
}
