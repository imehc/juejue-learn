import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import type { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';

/** 配置文件 */
declare namespace Config {
  /** 数据库 */
  interface Database {
    type: PostgresConnectionOptions['type'] | MysqlConnectionOptions['type'];
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    synchronize: boolean;
  }
  /** redis */
  interface Redis {
    port: number;
    host: string;
    password?: string;
    db: number;
  }
  /** App */
  interface Server {
    port: number;
    url: string;
    language: string;
  }
}
