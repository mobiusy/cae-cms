import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';
import { FileCategoryEnum } from './file-type.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

export class BucketInfoDTO {
  @ApiProperty({
    type: String,
    description: 'bucket名称',
  })
  name: string;

  @ApiProperty({
    type: Date,
    description: '创建时间',
  })
  creationDate: Date;
}
export class ListBucketResDTO {
  @ApiProperty({
    type: [BucketInfoDTO],
    description: 'bucket列表',
  })
  list: BucketInfoDTO[];
}

export class HeadBucketResDTO {
  @ApiProperty({
    type: String,
    description: 'bucket名称',
  })
  bucket: string;

  @ApiProperty({
    type: Boolean,
    description: 'bucket是否存在',
  })
  isExist: boolean;
}

export class OSSFileKeyDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'oss文件key',
  })
  key: string;
}

export class PresignedUploadInfoReqDTO {
  @IsEnum(FileCategoryEnum)
  @ApiProperty({ enum: FileCategoryEnum, description: '文件所属分类' })
  fileCategory: FileCategoryEnum;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: '文件名称',
    example: 'test.png',
  })
  fileName: string;
}
export class PresignedUploadInfoResDTO extends OSSFileKeyDTO {
  @ApiProperty({
    type: String,
    description: '文件上传请求地址',
  })
  presignedUrl: string;

  @ApiProperty({
    type: String,
    description: '文件访问地址',
  })
  accessUrl: string;
}

export class UploadInfoReqDTO extends PickType(PresignedUploadInfoReqDTO, [
  'fileCategory',
]) {
  @ApiProperty({
    type: String,
    description: '文件',
    format: 'binary',
  })
  file: string;
}

export class UploadInfoResDTO extends PickType(PresignedUploadInfoResDTO, [
  'key',
  'accessUrl',
]) {}

export class CreateFileFromUrlReqDTO {
  @IsUrl()
  @ApiProperty({
    type: String,
    description: '文件url',
  })
  url: string;

  @IsEnum(FileCategoryEnum)
  @ApiProperty({ enum: FileCategoryEnum, description: '文件所属分类' })
  fileCategory: FileCategoryEnum;
}


export class ListBucketObjectsReqDTO {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: '存储桶名称',
  })
  bucket: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '文件前缀',
    required: false,
  })
  prefix?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '文件数量',
    required: false,
  })
  maxKeys?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    type: String,
    description: '分页标识',
    required: false,
  })
  nextContinuationToken?: string;
}

export class ObjectInfoDTO {
  @ApiProperty({
    type: String,
    description: '文件key',
  })
  key: string;

  @ApiProperty({
    type: Date,
    description: '文件最后修改时间',
  })
  lastModified: Date;

  @ApiProperty({
    type: String,
    description: '文件ETag',
  })
  eTag: string;

  @ApiProperty({
    type: Number,
    description: '文件大小',
  })
  size: number;
}

export class ListBucketObjectsResDTO {
  @ApiProperty({
    type: [ObjectInfoDTO],
    description: '文件列表',
  })
  list: ObjectInfoDTO[];

  @ApiProperty({
    type: Boolean,
    description: '是否还有下一页',
  })
  isTruncated: boolean;

  @ApiProperty({
    type: String,
    description: '分页标识',
  })
  nextContinuationToken: string;

  @ApiProperty({
    type: Number,
    description: '文件数量',
  })
  keyCount: number;
}