import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Redirect,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { FilesInterceptor } from '@nestjs/platform-express';
import fs from 'fs';
import { CodeDto, FileDto, UrlDto, WeatherDto } from './app.dto';
import { ApiDoc } from './helper/decorator/custom.decorator';
import { pinyin } from 'pinyin-pro';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { FileVo, WeatherWithDay, WeatherVo, Location } from './app.vo';
import { RedisService } from './redis/redis.service';
import { weatherWrapper } from './helper/helper';
import { ShortLongMapService } from './helper/service/short-long-map.service';

@Controller()
export class AppController {
  constructor(private readonly configService: ConfigService) {}

  private readonly logger = new Logger();

  @Inject(HttpService)
  private httpService: HttpService;

  @Inject(RedisService)
  private redisService: RedisService;

  @Inject(ShortLongMapService)
  private shortLongMapService: ShortLongMapService;

  // TODO: 断点、错误续传
  // 前端切片上传参考： /templates/upload.html
  @ApiDoc({
    operation: {
      description: '文件切片上传',
      operationId: 'uploadFile',
      tags: ['file'],
    },
    consumes: ['multipart/form-data'],
    body: { type: FileDto },
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
    response: { type: FileVo },
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

  @ApiDoc({
    operation: {
      description: '获取未来三天天气信息',
      operationId: 'getThreeDayForecast',
      tags: ['weather'],
    },
    extraModels: [WeatherWithDay, Location],
    response: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['location', 'data'],
            properties: {
              location: {
                $ref: '#/components/schemas/Location',
              },
              data: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/WeatherWithDay',
                },
              },
            },
          },
        },
      },
    },
    noBearerAuth: true,
  })
  @Get('weather/:city')
  public async weather(@Param() { city }: WeatherDto) {
    const handleResponse = (code: string) => {
      // TODO: https://dev.qweather.com/docs/resource/error-code/#error-code-v2
      // 当前为v1版本 https://dev.qweather.com/docs/resource/error-code/#error-code-v1
      switch (code) {
        case '200':
          return true;
        case '204':
          throw new Error('查询的地区暂时没有你需要的数据');
        case '400':
          throw new Error('可能包含错误的请求参数或缺少必选的请求参数');
        case '401':
          throw new Error('可能使用了错误的KEY、KEY的类型错误');
        case '402':
          throw new Error('超过访问次数或余额不足以支持继续访问服务');
        case '403':
          throw new Error(
            '无访问权限，可能是绑定的PackageName、BundleID、域名IP地址不一致，或者是需要额外付费的数据',
          );
        case '404':
          throw new Error('查询的数据或地区不存在');
        case '404':
          throw new Error('超过限定的QPM（每分钟访问次数）');
        default:
          throw new Error('接口服务异常');
      }
    };

    const cy = pinyin(city, { toneType: 'none', type: 'array' }).join('');
    const cacheData = (await this.redisService.get(
      weatherWrapper(cy),
    )) as unknown as
      | { location: Location; data?: WeatherWithDay[] }
      | undefined;
    if (cacheData?.data?.length) {
      return cacheData;
    }
    const baseURL = 'https://geoapi.qweather.com/v2/city/lookup';
    // doc https://dev.qweather.com/docs/api/weather/weather-daily-forecast/
    const baseURL2 = 'https://devapi.qweather.com/v7/weather/3d'; // 免费订阅地址
    const url = `${baseURL}?location=${cy}&key=${this.configService.get('weather.key')}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    if (handleResponse(data.code)) {
      const location = data?.['location']?.[0] as Location | undefined;
      if (!location) {
        throw new BadRequestException('没有对应的城市信息');
      }
      const url2 = `${baseURL2}?location=${location.id}&key=${this.configService.get('weather.key')}`;
      const { data: weatherData } = await firstValueFrom(
        this.httpService.get<WeatherVo>(url2),
      );
      if (handleResponse(weatherData.code)) {
        const value = {
          location,
          data: weatherData.daily,
        };
        // 定时任务 清除天气数据
        await this.redisService.set(weatherWrapper(cy), JSON.stringify(value));
        return value;
      }
    }
  }

  @ApiDoc({
    operation: {
      description: '生成短链接',
      operationId: 'generateShortUrl',
      tags: ['url'],
    },
    response: {
      content: {
        'application/json': {
          schema: {
            properties: {
              url: { type: 'string' },
            },
          },
        },
      },
    },
    noBearerAuth: true,
  })
  @Get('short-url')
  public async generateShortUrl(@Query() { url }: UrlDto) {
    const shortUrl = await this.shortLongMapService.generate(url);
    return {
      url: shortUrl,
    };
  }

  @ApiDoc({
    operation: {
      description: '短链接重定向',
      operationId: 'redirect',
      tags: ['url'],
    },
    response: { status: 302 },
    noBearerAuth: true,
  })
  // 添加一个短的且不会被使用的前缀，避免影响其他路由
  @Get('v/:code')
  @Redirect()
  public async redirect(@Param() { code }: CodeDto) {
    const url = await this.shortLongMapService.getLongUrl(code);
    // return res.status(302).redirect(url);
    return {
      url,
      status: 302,
    };
  }
}
