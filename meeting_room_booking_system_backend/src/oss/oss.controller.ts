import { Controller, Get, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { PresignedUrlVo } from './vo/presigned-url.vo';
import { v4 as uuidv4 } from 'uuid';
import { RequireLogin } from 'src/helper/custom.decorator';
import { ConfigurationImpl } from 'src/config/configuration-impl';
import { OSS_CLIENT } from './oss.constants';

@RequireLogin()
@Controller('oss')
export class OssController {
  @Inject(OSS_CLIENT)
  private ossClient: S3Client;

  @Inject(ConfigService)
  private configService: ConfigService<ConfigurationImpl, true>;

  @ApiBearerAuth()
  @ApiOkResponse({ description: '预设上传链接', type: PresignedUrlVo })
  @ApiOperation({
    description: '上传文件到OSS',
    operationId: 'get-presigned-url',
    tags: ['file'],
  })
  @Get('presigned-url')
  async presignedPutObject() {
    const presignedPutUrl = await getSignedUrl(
      this.ossClient,
      new PutObjectCommand({
        Bucket: this.configService.get('oss-server.bucket-name'),
        Key: uuidv4(),
      }),
      { expiresIn: +(this.configService.get('oss-server.expires') ?? 60 * 60) },
    );
    return { presignedPutUrl };
  }
}
