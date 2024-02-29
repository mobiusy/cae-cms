import {
  ListBucketsCommand,
  S3Client,
  CreateBucketCommand,
  DeleteBucketCommand,
  ListObjectsCommand,
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  HeadBucketCommand,
  S3ServiceException,
  PutBucketPolicyCommand,
  DeleteObjectsCommand,
  CopyObjectCommand,
  CopyObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import {
  CreateFileFromUrlReqDTO,
  PresignedUploadInfoReqDTO,
  UploadInfoReqDTO,
  UploadInfoResDTO,
} from './dto/s3.dto';
import { FileCategoryEnum, S3_PATH_PREFIX } from './dto/file-type.dto';
import { nanoid } from 'nanoid';
import { isURL } from 'class-validator';
import { AppConfigService } from 'src/app-config/app-config.service';
import { S3Exception } from '@app/base-lib';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  constructor(
    private readonly s3Client: S3Client,
    private readonly configService: AppConfigService,
  ) {}

  //#Business Api
  public async putObjectFromUrl(
    dto: CreateFileFromUrlReqDTO,
  ): Promise<UploadInfoResDTO> {
    const { url, fileCategory } = dto;
    // extract file name and file extension from original name
    const originalname = url.split('/').pop();
    const key = this.generateFileKey(originalname, fileCategory);

    const { bucket } = this.configService.s3;
    const response = await fetch(url);
    const body = await response.arrayBuffer();
    const mimetype = response.headers.get('content-type');
    if (response.status !== 200) {
      throw new InternalServerErrorException('fetch file error');
    }
    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(body),
      ContentType: mimetype,
    });

    try {
      await this.s3Client.send(cmd);
      const accessUrl = await this.getObjectUrl(key);
      return {
        key,
        accessUrl,
      };
    } catch (error) {
      this.logger.error('upload oss file error');
      this.logger.error(error);
      if (error instanceof S3ServiceException) {
        throw new S3Exception(error.message, {
          cause: error,
        });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   *
   * @param dto
   * @returns
   */
  async getPreUploadInfo(dto: PresignedUploadInfoReqDTO) {
    try {
      const { fileCategory, fileName: originalname } = dto;
      const key = this.generateFileKey(originalname, fileCategory);
      const s3Config = this.configService.s3;
      const presignedUrl = await this.createPresignedUrl(s3Config.bucket, key);
      const accessUrl = this.toPublicAccessUrl(presignedUrl);

      return {
        key,
        presignedUrl,
        accessUrl,
      };
    } catch (error) {
      this.logger.error('get presigned url error');
      this.logger.error(error);
      if (error instanceof S3ServiceException) {
        throw new S3Exception(error.message, {
          cause: error,
        });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * 由后端接收文件，上传
   * @returns
   */
  async uploadFile(
    dto: UploadInfoReqDTO,
    file: Express.Multer.File,
  ): Promise<UploadInfoResDTO> {
    const { originalname, mimetype, buffer } = file;
    const { fileCategory } = dto;

    // extract file name and file extension from original name
    const key = this.generateFileKey(originalname, fileCategory);
    const { bucket } = this.configService.s3;

    const cmd = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    });

    try {
      await this.s3Client.send(cmd);
      const accessUrl = await this.getObjectUrl(key);
      return {
        key,
        accessUrl,
      };
    } catch (error) {
      this.logger.error('upload oss file error');
      this.logger.error(error);
      if (error instanceof S3ServiceException) {
        throw new S3Exception(error.message, {
          cause: error,
        });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  generateFileKey(originalname: string, fileCategory: FileCategoryEnum) {
    const prefix = S3_PATH_PREFIX[fileCategory];
    // append random string to file name
    const { filename, extension } = this.extractOriginName(originalname);
    let key = `${prefix}${filename}_${nanoid(10)}`;
    if (extension) {
      key = [key, extension].join('.');
    }
    return key;
  }

  private extractOriginName(originalname: string) {
    const parts = originalname.split('.');
    let extension = '';
    if (parts.length > 1) {
      extension = parts.pop();
    }
    const filename = parts.join('.');
    return { filename, extension };
  }

  /**
   * 文件删除
   * @param key
   * @returns
   */
  async deleteFile(key: string) {
    if (!key) {
      return key;
    }
    const { bucket } = this.configService.s3;
    try {
      await this.deleteObject(bucket, key);
      return key;
    } catch (error) {
      this.logger.error('delete oss file error');
      this.logger.error(error);
      if (error instanceof S3ServiceException) {
        throw new S3Exception(error.message, {
          cause: error,
        });
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * 通过文件key获取文件公开访问连接
   * @param key
   * @returns
   */
  async getObjectUrl(key: string): Promise<string | null> {
    if (!key) {
      return null;
    }

    if (isURL(key)) {
      return key;
    }
    // get object url by key
    const { bucket } = this.configService.s3;
    const url = await this.createPresignedUrl(bucket, key);

    return this.toPublicAccessUrl(url);
  }

  /**
   * 签名url转换为公开访问url
   * @param presignedUrl
   * @returns
   */
  toPublicAccessUrl(presignedUrl: string) {
    const { accessDomain } = this.configService.s3;
    const url = new URL(presignedUrl);
    return `${accessDomain}${url.pathname}`;
  }

  //#endregion

  //#region S3 Basic Api

  public async listBuckets() {
    const data = await this.s3Client.send(new ListBucketsCommand({}));
    return data.Buckets;
  }

  public async headBucket(bucket: string) {
    const res = {
      bucket,
      isExist: false,
    };
    const cmd = new HeadBucketCommand({
      Bucket: bucket,
    });
    try {
      await this.s3Client.send(cmd);
      res.isExist = true;
      return res;
    } catch (error) {
      if (error instanceof S3ServiceException) {
        if (error.$metadata.httpStatusCode === 404) {
          return res;
        }
        console.log(`S3ServiceException`);
        console.log(error);
      }
      throw error;
    }
  }

  public async createBucket(bucket: string) {
    const cmd = new CreateBucketCommand({
      Bucket: bucket,
    });
    const data = await this.s3Client.send(cmd);
    return data;
  }

  /**
   * 设置存储桶文件公开读取策略
   * @param bucket
   * @returns
   */
  public async setBucketPublicReadPolicy(bucket: string) {
    const cmd = new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${bucket}/*`],
          },
        ],
      }),
    });
    const data = await this.s3Client.send(cmd);
    return data;
  }

  public async deleteBucket(bucket: string) {
    const cmd = new DeleteBucketCommand({
      Bucket: bucket,
    });
    const data = await this.s3Client.send(cmd);
    return data;
  }

  public async emptyBucket(bucket: string) {
    const listObjectsCommand = new ListObjectsCommand({ Bucket: bucket });
    const listObjectsResult = await this.s3Client.send(listObjectsCommand);
    const objects = listObjectsResult.Contents;
    const objectIdentifiers = objects.map((o) => ({ Key: o.Key }));
    const deleteObjectsCommand = new DeleteObjectsCommand({
      Bucket: bucket,
      Delete: { Objects: objectIdentifiers },
    });

    return this.s3Client.send(deleteObjectsCommand);
  }

  public async listObjects(bucket: string) {
    const data = await this.s3Client.send(
      new ListObjectsCommand({
        Bucket: bucket,
      }),
    );
    return data;
  }

  private async deleteObject(bucket: string, key: string) {
    const data = await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return data;
  }

  public async putObject(
    bucket: string,
    key: string,
    body: PutObjectCommandInput['Body'],
  ) {
    const data = await this.s3Client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body,
      }),
    );
    return data;
  }

  public async createPresignedUrl(bucket: string, key: string, expires = 60) {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    return getSignedUrl(this.s3Client, command, { expiresIn: expires });
  }

  public async copyObject(
    ossKey: string,
    targetKey: string,
  ): Promise<CopyObjectCommandOutput> {
    const { bucket } = this.configService.s3;
    const data = await this.s3Client.send(
      new CopyObjectCommand({
        Bucket: bucket,
        Key: targetKey,
        CopySource: `${bucket}/${ossKey}`,
      }),
    );
    return data;
  }

  //#endregion
}
