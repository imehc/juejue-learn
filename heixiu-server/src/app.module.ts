import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OssModule } from './oss/oss.module';

@Module({
  imports: [OssModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
