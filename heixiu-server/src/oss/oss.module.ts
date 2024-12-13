import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigurationImpl } from 'src/helper/configuration';
import { MINIO_CLIENT } from 'src/helper/const';
import { Client } from 'minio';
import { OssController } from './oss.controller';

@Global()
@Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      async useFactory(configService: ConfigService<ConfigurationImpl>) {
        const client = new Client({
          endPoint: configService.get('minio-server.endpoint'),
          port: +configService.get('minio-server.port'),
          useSSL: false,
          accessKey: configService.get('minio-server.access-key'),
          secretKey: configService.get('minio-server.secret-key'),
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MINIO_CLIENT],
  controllers: [OssController],
})
export class OssModule {}
