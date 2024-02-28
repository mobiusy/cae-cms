import { IsEnum, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { FileCategoryEnum } from './file-type.dto';
import { ApiProperty, PickType } from '@nestjs/swagger';

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
