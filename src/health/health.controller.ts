import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  MicroserviceHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { RedisOptions, Transport } from '@nestjs/microservices';
import { ApiTags } from '@nestjs/swagger';
import { AppConfigService } from 'src/app-config/app-config.service';
import { PrismaService } from 'nestjs-prisma';

@ApiTags('健康')
@Controller('health')
export class HealthController {
  constructor(
    private _configService: AppConfigService,
    private _prisma: PrismaService,
    private _health: HealthCheckService,
    private _db: PrismaHealthIndicator,
    private _micorService: MicroserviceHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this._health.check([
      () => this._db.pingCheck('DB', this._prisma),
      () =>
        this._micorService.pingCheck<RedisOptions>('Redis', {
          transport: Transport.REDIS,
          options: this._configService.redis,
        }),
    ]);
  }
}
