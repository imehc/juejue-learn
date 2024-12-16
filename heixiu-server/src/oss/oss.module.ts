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
          endPoint: 'minio-container',
          port: 9000,
          useSSL: false,
          accessKey: '9y41oEm6fqOlJ2hPn9Yj',
          secretKey:'SDpZdIyCTmSvjz0D0mw1PVAAGfFcDoAvVQJIYVFW',
        });
        return client;
      },
    },
  ],
  exports: ['MINIO_CLIENT'],
  controllers: [OssController],
})
export class OssModule {}
