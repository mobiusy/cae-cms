import { Injectable, Logger } from '@nestjs/common';
import { IncPVReqDto } from './dto/inc-pv-req';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { FindPVResDto } from './dto/find-pv-req';
import { PvNotFoundException } from '@app/base-lib/errors/pv-not-found-exception';

@Injectable()
export class StatisticService {
  private readonly PV_KEY = 'website_pv';
  private readonly logger = new Logger(StatisticService.name);
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async incPV(dto: IncPVReqDto) {
    const { path } = dto;
    const pv = await this.redis.hincrby(this.PV_KEY, path, 1);
    return pv;
  }

  async find(path: string): Promise<FindPVResDto> {
    const pv = await this.redis.hget(this.PV_KEY, path);
    if (pv === null) {
      throw new PvNotFoundException();
    }
    this.logger.log(`${path} pv is ${pv}`);
    return {
      pv: Number(pv),
    };
  }
}
