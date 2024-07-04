import { DataSource } from 'typeorm';
import { config } from 'dotenv';

import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { Booking } from './booking/entities/booking.entity';

config({ path: 'src/.env-migration' });

console.log(process.env);

export default new DataSource({
  type: 'mysql',
  host: `${process.env.mysql_server_host}`,
  port: +`${process.env.mysql_server_port}`,
  username: `${process.env.mysql_server_username}`,
  password: `${process.env.mysql_server_password}`,
  database: `${process.env.mysql_server_database}`,
  synchronize: false,
  logging: true,
  entities: [User, Role, Permission, MeetingRoom, Booking],
  poolSize: 10,
  migrations: ['src/migrations/**.ts'],
  connectorPackage: 'mysql2',
});

// 生成了 create table 的 migration
// pnpm migration:generate ./src/migrations/init
// 迁移
// pnpm migration:run
// 执行 create 生成 migration 类 生成了空的 migration，填入了导出的 inert 语句
// pnpm migration:create src/migrations/data
// 编写完成后执行
// pnpm migration:run
