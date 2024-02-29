import { Global, Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { S3Controller } from './s3.controller';
import { S3Client } from '@aws-sdk/client-s3';
import { AppConfigService } from 'src/app-config/app-config.service';
import { S3AdminController } from './s3-admin.controller';

@Global()
@Module({
  controllers: [S3Controller, S3AdminController],
  providers: [
    S3Service,
    {
      provide: S3Client,
      useFactory: (configService: AppConfigService) => {
        const config = configService.s3;
        return new S3Client({
          region: config.region,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
          endpoint: config.endpoint,
          forcePathStyle: config.forcePathStyle,
        });
      },
      inject: [AppConfigService],
    },
  ],
})
export class S3Module {}
