import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis, RelationalDB, S3 } from 'src/app-config/dto/config.dto';

@Injectable()
export class AppConfigService {
  private readonly logger = new Logger(AppConfigService.name);
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

  get relationalDBConnectStr(): string {
    const config = this.relationalDB;
    const dbUser = encodeURIComponent(config.dbUser);
    const dbPwd = encodeURIComponent(config.dbPwd);
    const hosts = config.hostsPool.join(',');
    const { type, dbName } = config;

    const dbUrl = `${type}://${dbUser}:${dbPwd}@${hosts}/${dbName}`;
    this.logger.log(
      `connectionString: ${dbUrl.replace(dbPwd, '***')}`,
      'ConfigurationService',
    );

    return dbUrl;
  }
}
