import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  Query,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';
import { ConfigurationImpl } from 'src/helper/configuration';
import { MINIO_CLIENT } from 'src/helper/const';
import { ApiDoc } from 'src/helper/decorator/custom.decorator';
import { isDevelopment } from 'src/helper/utils';
import { PresignedUrlVo } from './vo/presigned-url.vo';
import { OssQueryDto } from './oss.dto';

@Controller('oss')
export class OssController {
  constructor(
    private readonly configService: ConfigService<ConfigurationImpl>,
  ) {}

  private readonly logger = new Logger(OssController.name);

  @Inject(MINIO_CLIENT)
  private minioClient: Client;

  @ApiDoc({
    operation: {
      description: '获取预签名上传地址',
      operationId: 'getPresignedUrl',
      tags: ['file'],
    },
    response: {
      type: PresignedUrlVo,
      description: '预签名上传地址',
    },
    noBearerAuth: isDevelopment,
  })
  @Get('presigned-url')
  async presignedPutObject(@Query() { name }: OssQueryDto) {
    const expiresIn = +(
      this.configService.get('minio-server.expires') ?? 60 * 60
    );
    try {
      const presignedPutUrl = await this.minioClient.presignedPutObject(
        // 需要确保存储桶（bucket）存在，不存在则去9001端口创建
        this.configService.get('minio-server.bucket-name'),
        name,
        expiresIn,
      );
      return {
        presignedPutUrl,
        expiresIn: Math.floor(expiresIn + new Date().getTime() / 1000), // 到期具体时间
      };
    } catch (error) {
      this.logger.log(error);
      throw new InternalServerErrorException('服务异常');
    }
  }
}
