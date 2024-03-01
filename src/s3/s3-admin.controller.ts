import { Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { S3Service } from './s3.service';
import { HeadBucketResDTO, ListBucketObjectsReqDTO, ListBucketObjectsResDTO, ListBucketResDTO } from './dto/s3.dto';

@ApiTags('OSS Admin')
@Controller({ path: 'oss-admin', version: '1' })
export class S3AdminController {
  constructor(private readonly _s3Service: S3Service) {}

  @Get('list-bucket')
  @ApiOperation({
    summary: '获取所有bucket',
  })
  @ApiOkResponse({
    type: ListBucketResDTO,
  })
  async listBucket() {
    return this._s3Service.listBuckets();
  }

  @Get('head-bucket/:bucket')
  @ApiOperation({
    summary: '检查bucket是否存在',
  })
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  @ApiOkResponse({
    type: HeadBucketResDTO,
  })
  async headBucket(@Param('bucket') bucket: string) {
    return this._s3Service.headBucket(bucket);
  }

  @Post('create-bucket/:bucket')
  @ApiOperation({
    summary: '创建bucket',
  })
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async createBucket(@Param('bucket') bucket: string) {
    return this._s3Service.createBucket(bucket);
  }

  @Put('set-bucket-public-read-policy/:bucket')
  @ApiOperation({
    summary: '设置bucket为公共读',
  })
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async setBucketPublicReadPolicy(@Param('bucket') bucket: string) {
    return this._s3Service.setBucketPublicReadPolicy(bucket);
  }

  @Delete('delete-bucket/:bucket')
  @ApiOperation({
    summary: '删除bucket',
  })
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  @ApiOkResponse({
    type: Boolean,
  })
  async deleteBucket(@Param('bucket') bucket: string) {
    return this._s3Service.deleteBucket(bucket);
  }

  @Get('list-objects/:bucket')
  @ApiOperation({
    summary: '列出bucket下的所有对象',
  })
  @ApiOkResponse({
    type: ListBucketObjectsResDTO,
  })
  async listObjects(@Query() query: ListBucketObjectsReqDTO) {
    return this._s3Service.listObjects(query);
  }
 
  @Get('presigned-url/:bucket/:key')
  @ApiOperation({
    summary: '生成预签名URL',
  })
  @ApiParam({
    name: 'bucket',
    description: 'bucket名称',
  })
  @ApiParam({
    name: 'key',
    description: '文件名称',
  })
  @ApiOkResponse({
    type: String,
  })
  async createPresignedUrl(
    @Param('bucket') bucket: string,
    @Param('key') key: string,
  ) {
    return this._s3Service.createPresignedUrl(bucket, key);
  }
}
