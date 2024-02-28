import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './app-config/app-config.service';
import { AppConfigModule } from './app-config/app-config.module';
import { S3Module } from './s3/s3.module';
import configuration from './app-config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AppConfigModule,
    S3Module,
  ],
  controllers: [],
  providers: [AppConfigService],
})
export class AppModule {}
