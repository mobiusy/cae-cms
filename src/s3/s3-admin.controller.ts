import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3.service';

@ApiTags('OSS Admin')
@Controller({ path: 'oss-admin', version: '1' })
export class S3AdminController {
  constructor(private readonly _s3Service: S3Service) {}

  @Get('list-bucket')
  async listBucket() {
    return this._s3Service.listBuckets();
  }

  @Get('head-bucket/:bucket')
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  async headBucket(@Param('bucket') bucket: string) {
    return this._s3Service.headBucket(bucket);
  }

  @Post('create-bucket/:bucket')
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  async createBucket(@Param('bucket') bucket: string) {
    return this._s3Service.createBucket(bucket);
  }

  @Put('set-bucket-public-read-policy/:bucket')
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  async setBucketPublicReadPolicy(@Param('bucket') bucket: string) {
    return this._s3Service.setBucketPublicReadPolicy(bucket);
  }

  @Delete('delete-bucket/:bucket')
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  async deleteBucket(@Param('bucket') bucket: string) {
    return this._s3Service.deleteBucket(bucket);
  }

  @Get('list-objects/:bucket')
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  async listObjects(@Param('bucket') bucket: string) {
    return this._s3Service.listObjects(bucket);
  }

  @Get('presigned-url/:bucket/:key')
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  @ApiParam({
    name: 'key',
    description: '文件名称',
  })
  async createPresignedUrl(
    @Param('bucket') bucket: string,
    @Param('key') key: string,
  ) {
    return this._s3Service.createPresignedUrl(bucket, key);
  }
}
