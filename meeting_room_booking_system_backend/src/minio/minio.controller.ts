import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { Client } from 'minio';
import { PresignedUrlVo } from './vo/presigned-url.vo';
import { v4 as uuidv4 } from 'uuid';
import { RequireLogin } from 'src/helper/custom.decorator';
import { ConfigurationImpl } from 'src/config/configuration-impl';

@RequireLogin()
@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Client;

  @Inject(ConfigService)
  private configService: ConfigService<ConfigurationImpl>;

  @ApiBearerAuth()
  @ApiOkResponse({ description: '预设上传链接', type: PresignedUrlVo })
  @ApiOperation({
    description: '上传文件到OSS',
    operationId: 'get-presigned-url',
    tags: ['file'],
  })
  @Get('presigned-url')
  async presignedPutObject() {
    const presignedPutUrl = await this.minioClient.presignedPutObject(
      this.configService.get('minio-server.bucket-name'),
      uuidv4(),
      +(this.configService.get('minio-server.expires') ?? 60 * 60),
    );
    return { presignedPutUrl };
  }
}
