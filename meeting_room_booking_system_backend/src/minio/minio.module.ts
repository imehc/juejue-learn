import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioController } from './minio.controller';

// 文件上传OSS
@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      async useFactory(configService: ConfigService) {
        const client = new Client({
          endPoint: configService.get('minio_endpoint'),
          port: configService.get('minio_port'),
          useSSL: false,
          accessKey: configService.get('minio_access_key'),
          secretKey: configService.get('minio_secret_key'),
        });
        return client;
      },
      inject: [ConfigService],
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [MinioController],
})
export class MinioModule {}
