import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationImpl } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe()); // 全局启用
  
  const configService = app.get(ConfigService<ConfigurationImpl>);

  await app.listen(configService.get('nest-server.port'));
}
bootstrap();
