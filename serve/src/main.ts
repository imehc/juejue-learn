import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getServerConfig } from 'config/server.config';
import { writeFileSync } from 'fs';
import { dump } from 'js-yaml';
import { I18nMiddleware, I18nValidationPipe } from 'nestjs-i18n';
import { NestExpressApplication } from '@nestjs/platform-express';
import { BaseExceptionFilter } from './common/base.exception.filter';
import { OtherExceptionFilter } from './common/other.exception.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const { url, port } = getServerConfig();

  // 减少模版代码参考 https://docs.nestjs.com/openapi/cli-plugin#using-the-cli-plugin
  const config = new DocumentBuilder()
    .setTitle('exix system')
    .setDescription('api 接口文档')
    .setVersion('1.0')
    .addServer(url)
    .addBearerAuth({ type: 'http', description: '' })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // 写入到文件
  writeFileSync('./openapi.yaml', dump(document, {}));
  // http://localhost:6020/api-doc
  SwaggerModule.setup('swagger-ui', app, document);
  // 全局验证管道：处理请求参数的验证和转换
  app.useGlobalPipes(new I18nValidationPipe({ transform: true }));
  // 全局其它异常处理器: 注意执行顺序
  app.useGlobalFilters(new OtherExceptionFilter());
  // 全局请求异常过滤器：处理验证错误的国际化
  app.useGlobalFilters(new BaseExceptionFilter());
  // 国际化中间件：处理多语言支持
  app.use(I18nMiddleware);
  // 启用 CORS：允许跨域请求
  // 配置跨域资源共享，允许其他域名访问 API
  app.enableCors();
  await app.listen(port ?? 6020);
}

void bootstrap();
