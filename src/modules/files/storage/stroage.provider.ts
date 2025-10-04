import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { StorageServiceInterface } from '../interface/storage.interface';
import { STORAGE_S3_LIARA_CONST } from '../constant/files.constant';

export class S3StorageService implements StorageServiceInterface {
  private readonly _s3Client: S3Client;
  private readonly _bucketName: string;

  constructor(private readonly configService: ConfigService) {
    this._bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    this._s3Client = new S3Client({
      endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
      region: this.configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESS_KEY'),
      },
      maxAttempts: 3,
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
  ): Promise<{ s3Key: string; s3Url: string }> {
    const s3Key = `${userId}/${Date.now()}-${file.originalname}`;
    const command = new PutObjectCommand({
      Bucket: this._bucketName,
      Key: s3Key,
      Body: file.buffer,
      ContentType: file.mimetype,
    });

    await this._s3Client.send(command);

    const s3Url = `${this.configService.getOrThrow<string>('S3_ENDPOINT')}/${this._bucketName}/${s3Key}`;
    return { s3Key, s3Url };
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this._bucketName,
      Key: key,
    });
    await this._s3Client.send(command);
  }
}

export const StorageServiceProvider = {
  provide: STORAGE_S3_LIARA_CONST,
  useFactory: (configService: ConfigService): StorageServiceInterface => {
    return new S3StorageService(configService);
  },
  inject: [ConfigService],
};
