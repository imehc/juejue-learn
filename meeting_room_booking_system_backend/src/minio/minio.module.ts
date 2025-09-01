import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { MinioController } from './minio.controller';
import { ConfigurationImpl } from 'src/config/configuration-impl';

export const MINIO_CLIENT = 'MINIO_CLIENT';

// 文件上传OSS
@Global()
@Module({
  providers: [
    {
      provide: MINIO_CLIENT,
      useFactory(configService: ConfigService<ConfigurationImpl>) {
        const client = new Client({
          endPoint: configService.get('minio-server.endpoint'),
          port: +(configService.get('minio-server.port') || 9000),
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
  controllers: [MinioController],
})
export class MinioModule {}
