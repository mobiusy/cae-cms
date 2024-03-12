import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { S3Service } from './s3.service';
import {
  CreateFileFromUrlReqDTO,
  OSSFileKeyDTO,
  PresignedUploadInfoReqDTO,
  PresignedUploadInfoResDTO,
  UploadInfoReqDTO,
  UploadInfoResDTO,
} from './dto/s3.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('OSS')
@Controller({ path: 'oss', version: '1' })
// @Auth()
export class S3Controller {
  constructor(private readonly _s3Service: S3Service) {}

  @Get('upload/presigned-url')
  @ApiOperation({
    summary: '获取文件上传请求地址',
    description:
      '文件上传方式1: 获取文件oss上传请求地址，用于前端直接上传文件到oss, 不经过后端服务, 上传链接有效期为60s',
  })
  @ApiOkResponse({
    type: PresignedUploadInfoResDTO,
  })
  async getPreUploadInfo(
    @Query() query: PresignedUploadInfoReqDTO,
  ): Promise<PresignedUploadInfoResDTO> {
    return this._s3Service.getPreUploadInfo(query);
  }

  @Post('upload')
  @ApiOperation({
    summary: '上传文件',
    description: '文件上传方式2: 通过后端服务接口上传文件到oss',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOkResponse({
    type: UploadInfoResDTO,
  })
  async uploadFile(
    @Body() body: UploadInfoReqDTO,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this._s3Service.uploadFile(body, file);
  }

  @Post('url')
  @ApiOperation({
    summary: '获取文件地址',
    description: '通过key获取文件访问地址',
  })
  @ApiOkResponse({
    type: PresignedUploadInfoResDTO,
  })
  async getFileUrl(@Query() query: OSSFileKeyDTO) {
    return this._s3Service.getObjectUrl(query.key);
  }

  @Get('delete')
  @ApiOperation({
    summary: '删除oss文件',
  })
  @ApiOkResponse({
    type: String,
    description: '删除成功返回oss文件key',
  })
  async deleteFile(@Query() query: OSSFileKeyDTO) {
    const { key } = query;
    return this._s3Service.deleteFile(key);
  }

  @Post('create-from-url')
  @ApiOperation({
    summary: '通过url创建oss文件',
  })
  @ApiOkResponse({
    type: UploadInfoResDTO,
  })
  async createFileFromUrl(@Body() body: CreateFileFromUrlReqDTO) {
    return this._s3Service.putObjectFromUrl(body);
  }
}
