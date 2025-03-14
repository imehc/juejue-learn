import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from 'config/database.config';

export const LoadTypeOrm = TypeOrmModule.forRootAsync({
  useFactory: () => {
    const config = getDatabaseConfig();
    return {
      ...config,
      //   logging: true,
    };
  },
});
