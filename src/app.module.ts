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
            // log: ['query', 'info', 'warn', 'error'],
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
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
