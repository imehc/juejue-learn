import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioController } from './minio.controller';

export const MINIO_CLIENT = 'MINIO_CLIENT';

// 文件上传OSS
@Global()
@Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      async useFactory(configService: ConfigService) {
        const client = new Client({
          endPoint: configService.get('minio_endpoint'),
          port: +(configService.get('minio_port') || 9000),
          useSSL: false,
          accessKey: configService.get('minio_access_key'),
          secretKey: configService.get('minio_secret_key'),
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: [MINIO_CLIENT],
  controllers: [MinioController],
})
export class MinioModule {}
