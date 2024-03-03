import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';
import { ListBucketsCommand, S3Client } from '@aws-sdk/client-s3';
import { AppConfigService } from 'src/app-config/app-config.service';
import { S3 } from 'src/app-config/dto/config.dto';
import { ListBucketResDTO } from './dto/s3.dto';
const moduleMocker = new ModuleMocker(global);

describe('S3Service', () => {
  let service: S3Service;
  let bucketCreateDate = new Date();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3Service],
    })
    .useMocker((token) => {
      if (token === S3Client) {
        return {
          send: (arg: any) => {
            if (arg instanceof ListBucketsCommand) {
              return Promise.resolve({
                Buckets: [
                  { 
                    Name: 'mock-bucket',
                    CreationDate: bucketCreateDate,
                  },
                ],
              });
            }
          }
        };
      }
      if (token === AppConfigService) {
        return {
          get s3(): S3 {
            return {
              accessDomain: 'http://example.com',
              bucket: 'mock-bucket',
              region: 'mock-region',
              endpoint: 'http://example.com',
              forcePathStyle: false,
              accessKeyId: 'mock-access-key',
              secretAccessKey: 'mock-secret-key',
            };
          }
        }
      }
      if (typeof token === 'function') {
        const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
        const Mock = moduleMocker.generateFromMetadata(mockMetadata);
        return new Mock();
      }
    })
    .compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('toPublicAccessUrl', () => {
    const presignedUrl = 'http://example.com/mock-bucket/prefix/test.jpg?with-params=true&test=123';
    const expRes = 'http://example.com/mock-bucket/prefix/test.jpg';
    const recvRes = service.toPublicAccessUrl(presignedUrl);
    expect(recvRes).toEqual(expRes);
  });

  it('listBuckets Success', async () => {
    const expRes: ListBucketResDTO = {
      list: [
        {
          name: 'mock-bucket',
          creationDate: bucketCreateDate,
        }
      ]
    };

    const revcRes = await service.listBuckets();
    expect(revcRes).toEqual(expRes);
  })
});
