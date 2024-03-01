import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
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

  /**
   * 拼接标准ioRedis配置
   */
  get redisConfig(): RedisOptions {
    const redisConfig = this.redis;
    const options: Record<string, any> = {};
    switch (redisConfig.type) {
      case 'standalone':
        options.host = redisConfig.redisServer;
        options.port = redisConfig.redisPort;
        break;
      case 'sentinel':
        options.sentinels = redisConfig.sentinels;
        options.name = redisConfig.name;
        if (redisConfig.sentinelPassword) {
          options.sentinelPassword = redisConfig.sentinelPassword;
        }
        break;
      default:
        throw new Error('Unsupported Redis Type!');
    }
    return {
      ...options,
      password: redisConfig.redisPassword,
      db: redisConfig.redisdb,
    };
  }

  /**
   * 生成数据库连接字符串
   */
  get relationalDBConnectStr(): string {
    const config = this.relationalDB;
    const dbUser = encodeURIComponent(config.dbUser);
    const dbPwd = encodeURIComponent(config.dbPwd);
    const hosts = config.hostsPool.join(',');
    const { type, dbName } = config;

    const dbUrl = `${type}://${dbUser}:${dbPwd}@${hosts}/${dbName}`;

    // 日志中密码掩码
    this.logger.log(
      `connectionString: ${dbUrl.replace(dbPwd, '***')}`,
      'ConfigurationService',
    );

    return dbUrl;
  }
}
