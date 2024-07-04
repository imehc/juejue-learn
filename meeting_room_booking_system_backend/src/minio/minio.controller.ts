import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from 'minio';

@Controller('minio')
export class MinioController {
  @Inject('MINIO_CLIENT')
  private minioClient: Client;

  @Inject(ConfigService)
  private configService: ConfigService;

  @Get('presigned-url')
  presignedPutObject(@Query('name') name: string) {
    return this.minioClient.presignedPutObject(
      name,
      this.configService.get('minio_bucket_name'),
      +(this.configService.get('minio_expires') ?? 60 * 60),
    );
  }
}
