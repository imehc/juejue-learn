import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { SkipThrottle } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express';
import fs from 'fs';
import { FileDto, File } from './app.dto';
import { ApiDoc } from './helper/custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  // TODO: 断点、错误续传
  // 前端切片上传参考： /templates/upload.html
  @ApiDoc({
    operation: {
      description: '文件切片上传',
      operationId: 'uploadFile',
      tags: ['file'],
    },
    response: { status: HttpStatus.CREATED },
    noBearerAuth: process.env.NODE_ENVIRONMENT !== 'production',
  })
  @SkipThrottle()
  @Post('upload-file')
  @UseInterceptors(FilesInterceptor('files', 20, { dest: 'uploads' }))
  public async updateFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() { name }: FileDto,
  ) {
    const fileName = name.match(/(.+)\-\d+$/)?.[1];
    const chunkDir = 'uploads/chunks_' + fileName;
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    fs.cpSync(files[0].path, chunkDir + '/' + name); // 复制
    fs.rmSync(files[0].path); // 删除
  }

  @ApiDoc({
    operation: {
      description: '文件切片合并',
      operationId: 'mergeFile',
      tags: ['file'],
    },
    response: { type: File },
    noBearerAuth: process.env.NODE_ENVIRONMENT !== 'production',
  })
  @Get('merge-file')
  public async mergeFile(@Query() { name }: FileDto) {
    const chunkDir = 'uploads/chunks_' + name;
    const fileExists = fs.existsSync(chunkDir);
    if (!fileExists) {
      throw new BadRequestException('该文件不存在');
    }
    try {
      const files = fs
        .readdirSync(chunkDir)
        // 数字排序 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#%E6%95%B0%E5%AD%97%E6%8E%92%E5%BA%8F
        .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
      let count = 0;
      let startPos = 0;
      for (const file of files) {
        const filePath = chunkDir + '/' + file; // 拼接到文件的路径
        const stream = fs.createReadStream(filePath);
        stream
          .pipe(fs.createWriteStream('uploads/' + name, { start: startPos }))
          .on('finish', () => {
            count++;
            if (count === files.length) {
              fs.rm(chunkDir, { recursive: true }, () => {});
            }
          });
        startPos += fs.statSync(filePath).size;
      }
      return {
        path: 'uploads/' + name,
      };
    } catch (error) {
      throw new BadRequestException('上传失败');
    }
  }
}
