import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { Role } from './user/entities/role.entity';
import { Permission } from './user/entities/permission.entity';
import { RedisModule } from './redis/redis.module';
import { EmailModule } from './email/email.module';
import { APP_GUARD } from '@nestjs/core';
import { LoginGuard } from './helper/login.guard';
import { PermissionGuard } from './helper/permission.guard';
import { MeetingRoomModule } from './meeting-room/meeting-room.module';
import { MeetingRoom } from './meeting-room/entities/meeting-room.entity';
import { BookingModule } from './booking/booking.module';
import { Booking } from './booking/entities/booking.entity';
import { StatisticModule } from './statistic/statistic.module';
import { MinioModule } from './minio/minio.module';
import { AuthModule } from './auth/auth.module';
import configuration from './config/configuration';
import { ConfigurationImpl } from './config/configuration-impl';
import { WinstonModule, utilities } from 'nest-winston';
import winston from 'winston';
import { CustomTypeormLogger } from './helper/custom-typeorm-logger';
import { WinstonLogger, WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import 'winston-daily-rotate-file';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      useFactory(configService: ConfigService<ConfigurationImpl>) {
        return {
          secret: configService.get('jwt.secret'),
          signOptions: {
            // https://github.com/vercel/ms?tab=readme-ov-file#examples
            expiresIn: configService.get('jwt.access-token-expires-time'), // 默认30分钟
          },
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      //  envFilePath: 'src/.env'
      // envFilePath: path.join(__dirname, '.env'),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (
        configService: ConfigService<ConfigurationImpl>,
        logger: WinstonLogger,
      ) => {
        return {
          type: 'mysql',
          host: configService.get('mysql-server.host'),
          port: configService.get('mysql-server.host'),
          username: configService.get('mysql-server.username'),
          password: configService.get('mysql-server.password'),
          database: configService.get('mysql-server.database'),
          synchronize: false,
          logging: true,
          logger: new CustomTypeormLogger(logger),
          entities: [User, Role, Permission, MeetingRoom, Booking],
          poolSize: 10,
          connectorPackage: 'mysql2',
        };
      },
      inject: [ConfigService, WINSTON_MODULE_NEST_PROVIDER],
    }),
    WinstonModule.forRootAsync({
      useFactory: (configService: ConfigService<ConfigurationImpl>) => ({
        level: 'debug', // 指定日志输出级别 debug
        // 输出到的 transport 包括 console 和 file
        transports: [
          // new winston.transports.File({
          //   filename: `${process.cwd()}/log`,
          // }), // 存放到单个文件
          new winston.transports.DailyRotateFile({
            level: configService.get('winston.log-level'),
            dirname: configService.get('winston.log-dirname'),
            filename: configService.get('winston.log-filename'),
            datePattern: configService.get('winston.log-date-pattern'),
            maxSize: configService.get('winston.log-max-size'),
          }),
          new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp(),
              utilities.format.nestLike(),
            ),
          }),
          // new winston.transports.Http({
          // host: 'localhost',
          // port: 3002,
          // path: '/log',
          // TODO: 接收日志服务的服务器
          // }),
        ],
      }),
      inject: [ConfigService],
    }),
    RedisModule,
    EmailModule,
    MeetingRoomModule,
    BookingModule,
    StatisticModule,
    MinioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // 全局启用这个 Guard
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
