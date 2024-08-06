import { Inject, Injectable } from '@nestjs/common';
import { DbModuleOptions } from './db.module';
import { access, readFile, writeFile } from 'fs/promises';

@Injectable()
export class DbService {
  @Inject('OPTIONS')
  private readonly options: DbModuleOptions;

  /** 读取文件内容转换为对象 */
  async read() {
    const filePath = this.options.path;
    try {
      await access(filePath);
    } catch (error) {
      return [];
    }
    const str = await readFile(filePath, { encoding: 'utf-8' });
    if (!str) {
      return [];
    }
    return JSON.parse(str);
  }

  /** 写入文件 */
  async write(obj: Record<string, any>) {
    await writeFile(this.options.path, JSON.stringify(obj || []), {
      encoding: 'utf-8',
    });
  }
}
