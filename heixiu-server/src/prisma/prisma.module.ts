import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // 设置为全局模块
@Module({
  providers: [PrismaService],
  exports: [
    PrismaService, // 导出PrismaService以供其它模块使用
  ],
})
export class PrismaModule {}
