import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RelationalDB, S3 } from 'src/app-config/dto/config.dto';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  get port(): number {
    return this.configService.get<number>('port');
  }

  get relationalDB(): RelationalDB {
    return this.configService.get<RelationalDB>('relationDB');
  }

  get redis(): Redis {
    return this.configService.get<Redis>('redis');
  }

  get s3(): S3 {
    return this.configService.get<S3>('s3');
  }
}
