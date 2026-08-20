import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { resolve } from 'path';

import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { Booking } from './booking/entities/booking.entity';

// 迁移在主机上执行，直接复用 deploy/.env 里的数据库凭据，
// 避免再维护一份重复的连接配置。host/port 默认连本机映射出来的端口
// （见 deploy/docker-compose.dev.yml），需要时用环境变量覆盖：
//   MYSQL_HOST=... MYSQL_PORT=... pnpm migration:run
config({ path: resolve(__dirname, '../../deploy/.env') });

export default new DataSource({
  type: 'mysql',
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: +(process.env.MYSQL_PORT || 3306),
  username: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: true,
  entities: [User, Role, Permission, MeetingRoom, Booking],
  poolSize: 10,
  migrations: ['src/migrations/**.ts'],
  connectorPackage: 'mysql2',
});

// 生成了 create table 的 migration
// entry 有变化需执行 pnpm migration:generate 存放地址
// pnpm migration:generate ./src/migrations/init

// 迁移
// pnpm migration:run

// 执行 create 生成 migration 类 生成了空的 migration，填入了导出的 inert 语句
// pnpm migration:create src/migrations/data

// 编写完成后执行
// pnpm migration:run
