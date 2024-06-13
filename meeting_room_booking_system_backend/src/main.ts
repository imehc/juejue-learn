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

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局启用
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new UnloginFilter());
  app.useGlobalFilters(new CustomExceptionFilter());

  initConfig(app);

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();

function initConfig(app: INestApplication<any>) {
  // 减少模版代码参考 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin
  const config = new DocumentBuilder()
    .setTitle('会议室预订系统')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addServer('http://localhost:6020')
    .addBearerAuth({ type: 'http', description: '基于jwt的认证' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 写入到文件
  writeFileSync('./openapi.yaml', dump(document, {}));
  // http://localhost:6020/api-doc
  SwaggerModule.setup('api-doc', app, document);
}
