import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import fs from 'fs';
import path from 'path';
import { weatherWrapper } from 'src/helper/helper';
import { UniqueCodeService } from 'src/helper/service/unique-code.service';
import { RedisService } from 'src/redis/redis.service';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);

  @Inject(RedisService)
  private readonly redisService: RedisService;

  @Inject(UniqueCodeService)
  private readonly uniqueCodeService: UniqueCodeService;

  /** 当天23:59:59清除天气缓存数据 */
  @Cron('59 59 23 * * *', { timeZone: 'Asia/Shanghai' })
  protected async clearWeatherCache() {
    await this.redisService.delByPattern(weatherWrapper());
  }

  /** 每天凌晨四点清除未能成功合并的文件 */
  @Cron(CronExpression.EVERY_DAY_AT_4AM, { timeZone: 'Asia/Shanghai' })
  protected clearTempFolder() {
    const prefix = 'chunks_'; // 要删除的文件夹前缀，约定为该前缀为大文件上传切片的临时文件夹前缀
    const uploadsDir = path.join(path.join(__dirname, '..', '..', 'uploads')); // 所在的文件夹
    try {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        const filePath = path.join(uploadsDir, file);
        // 是文件夹且前缀为切片的临时文件夹
        if (fs.lstatSync(filePath).isDirectory() && file.startsWith(prefix)) {
          this.deleteFolder(filePath);
        }
      }
    } catch (error) {
      this.logger.error(`Error reading uploads directory: ${error}`);
    }
  }

  /** 每天凌晨五点清除没有内容的日志文件 */
  @Cron(CronExpression.EVERY_DAY_AT_5AM, { timeZone: 'Asia/Shanghai' })
  protected clearEmptyLogs() {
    try {
      const logsDir = path.join(process.cwd(), 'logs');
      const files = fs.readdirSync(logsDir);
      for (const file of files) {
        const filePath = path.join(logsDir, file);
        // 是文件且后缀为.log
        if (fs.lstatSync(filePath).isFile() && file.endsWith('.log')) {
          const fileSize = fs.statSync(filePath).size;
          if (fileSize === 0) {
            fs.unlinkSync(filePath);
            this.logger.warn(`已删除空日志文件：${file}`);
          }
        }
      }
    } catch (error) {
      this.logger.warn(`Error deleting folder: ${error}`);
    }
  }

  private deleteFolder(folderPath: string) {
    if (fs.existsSync(folderPath)) {
      fs.readdirSync(folderPath).forEach((file) => {
        const filePath = path.join(folderPath, file);
        if (fs.lstatSync(filePath).isDirectory()) {
          this.deleteFolder(filePath);
        } else {
          fs.unlinkSync(filePath);
        }
      });
      fs.rmdirSync(folderPath);
      this.logger.warn(`Deleted folder: ${folderPath}`);
    } else {
      this.logger.warn(`Folder does not exist: ${folderPath}`);
    }
  }

  /** 每天凌晨3点生成一批唯一短码 */
  @Cron(CronExpression.EVERY_DAY_AT_3AM, { timeZone: 'Asia/Shanghai' })
  protected async generateCode() {
    await this.uniqueCodeService.generateCode();
  }
}