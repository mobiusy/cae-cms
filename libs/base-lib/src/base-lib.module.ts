import { Module } from '@nestjs/common';
import { BaseLibService } from './base-lib.service';

@Module({
  providers: [BaseLibService],
  exports: [BaseLibService],
})
export class BaseLibModule {}
