import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { UniqueCodeService } from 'src/helper/service/unique-code.service';
import { ShortLongMapService } from 'src/helper/service/short-long-map.service';

@Module({
  providers: [TaskService, UniqueCodeService, ShortLongMapService],
  exports: [ShortLongMapService],
})
export class TaskModule {}
