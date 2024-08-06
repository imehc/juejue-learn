import { DynamicModule, Module } from '@nestjs/common';
import { DbService } from './db.service';

export interface DbModuleOptions {
  path: string;
}

@Module({})
export class DbModule {
  // 动态模块
  static register(options: DbModuleOptions): DynamicModule {
    return {
      module: DbModule,
      providers: [{ provide: 'OPTIONS', useValue: options }, DbService],
      exports: [DbService],
    };
  }
}
