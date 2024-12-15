import { Global, Module } from '@nestjs/common';
import { Client } from 'minio';
import { OssController } from './oss.controller';

@Global()
@Module({
  providers: [
    {
      provide: 'MINIO_CLIENT',
      async useFactory() {
        const client = new Client({
          endPoint: 'localhost',
          port: 9000,
          useSSL: false,
          accessKey: 'xxxxxxxxxx',
          secretKey:'xxxxxxxxxxxxxxxxxxxx',
        });
        return client;
      },
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [OssController],
})
export class OssModule {}
