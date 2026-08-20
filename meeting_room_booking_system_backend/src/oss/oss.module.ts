import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client } from '@aws-sdk/client-s3';
import { OssController } from './oss.controller';
import { ConfigurationImpl } from 'src/config/configuration-impl';
import { OSS_CLIENT } from './oss.constants';

export { OSS_CLIENT };

// 对象存储（S3 协议）。用 AWS 官方 SDK 而不是 minio SDK：
// MinIO 仓库已归档，后端连的是 RustFS，只依赖标准 S3 协议，
// 换任何 S3 兼容实现（RustFS / Ceph / 真 AWS S3）都不用改代码。
@Global()
@Module({
  providers: [
    {
      provide: OSS_CLIENT,
      useFactory(configService: ConfigService<ConfigurationImpl>) {
        const endpoint = configService.get('oss-server.endpoint');
        const port = configService.get('oss-server.port') || '9000';
        const useSSL = configService.get('oss-server.use-ssl') === 'true';

        return new S3Client({
          // 自建 S3 服务没有 region 概念，但 SDK 强制要求填，
          // 且要与建桶时用的 region 一致（见 deploy 里的 rustfs-init）
          region: configService.get('oss-server.region') || 'us-east-1',
          endpoint: `${useSSL ? 'https' : 'http'}://${endpoint}:${port}`,
          // 自建服务不支持 bucket.host 这种 virtual-host 寻址，
          // 必须走 host/bucket 的 path-style
          forcePathStyle: true,
          credentials: {
            accessKeyId: configService.get('oss-server.access-key'),
            secretAccessKey: configService.get('oss-server.secret-key'),
          },
        });
      },
      inject: [ConfigService],
    },
  ],
  exports: [OSS_CLIENT],
  controllers: [OssController],
})
export class OssModule {}
