import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config/app-config.service';
import { AppConfigModule } from './app-config/app-config.module';
import { S3Module } from './s3/s3.module';
import { StatisticModule } from './statistic/statistic.module';
import configuration from './app-config/configuration';
import { RedisModule } from '@nestjs-modules/ioredis';
import { HealthModule } from './health/health.module';
import { PrismaModule, PrismaServiceOptions } from 'nestjs-prisma';


import {
  WinstonModule,
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import DailyRotateFile = require('winston-daily-rotate-file');
import winston from 'winston';

@Module({
  imports: [
    PrismaModule.forRootAsync({
      isGlobal: true,
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (_config: AppConfigService) => {
        const config: PrismaServiceOptions = {
          prismaOptions: {
            datasources: {
              db: {
                url: _config.relationalDBConnectStr,
              },
            },
            log: ['query', 'info', 'warn', 'error'],
          },
        };
        return config;
      },
    }),
    RedisModule.forRootAsync({
      useFactory: (configService: AppConfigService) => {
        return {
          type: 'single',
          url: `redis://${configService.redis.redisServer}:${configService.redis.redisPort}`,
          options: {
            password: configService.redis.redisPassword,
            db: configService.redis.redisdb,
          },
        };
      },
      inject: [AppConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AppConfigModule,
    S3Module,
    StatisticModule,
    HealthModule,
    WinstonModule.forRoot({
      exitOnError: false,
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('ACE-CMS', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/combined-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        new DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '7d',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
        // other transports...
      ],
    }),
  ],

  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
