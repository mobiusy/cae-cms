export interface S3 {
  accessDomain: string;
  bucket: string;
  region: string;
  endpoint: string;
  forcePathStyle: boolean;
  accessKeyId: string;
  secretAccessKey: string;
}

export interface RelationalDB {
  type: string;
  hostsPool: string[];
  dbName: string;
  dbUser: string;
  dbPwd: string;
}

export interface RedisNode {
  host: string;
  port: number;
}

export interface Redis {
  type: string;
  redisServer: string;
  redisPort: number;
  redisPassword: string;
  redisdb: number;
  name: string;
  sentinels: RedisNode[];
  sentinelPassword: string;
}