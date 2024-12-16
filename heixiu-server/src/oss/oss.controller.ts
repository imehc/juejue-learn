import {
  Controller,
  Get,
  Inject,
  InternalServerErrorException,
  Logger,
  Query,
} from '@nestjs/common';
import { Client } from 'minio';

@Controller('oss')
export class OssController {
  private readonly logger = new Logger(OssController.name);

  @Inject('MINIO_CLIENT')
  private minioClient: Client;

  @Get('presigned-url')
  async presignedPutObject(@Query('name') name: string) {
    const expiresIn = 3600;
    try {
      let presignedPutUrl = await this.minioClient.presignedPutObject(
       'heixiu',
        name,
        expiresIn,
      );
      return {
        presignedPutUrl,
        expiresIn: Math.floor(expiresIn + new Date().getTime() / 1000), // 到期具体时间
      };
    } catch (error) {
      this.logger.log(error);
      return error
      // throw new InternalServerErrorException('服务异常');
    }
  }
}
