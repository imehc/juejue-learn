import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { DbModule } from './db/db.module';
import { BookModule } from './book/book.module';

@Module({
  imports: [UserModule, DbModule, BookModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
