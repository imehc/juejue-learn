import {
  Injectable,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
// 继承 PrismaClient,可使用对应的api
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super({
      log: [
        { emit: 'stdout', level: 'query' }, // 打印sql到控制台
      ],
    });
  }

  async onModuleInit() {
    await this.$connect(); // 链接数据库
  }

  async onModuleDestroy() {
    await this.$disconnect(); // 断开数据库
  }
}
