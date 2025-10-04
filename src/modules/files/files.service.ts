import { S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { plainToInstance } from 'class-transformer';
import { Model } from 'mongoose';
import { STORAGE_S3_LIARA_CONST } from './constant/files.constant';
import { FileResponseDto } from './dto/file-response.dto';
import type { StorageServiceInterface } from './interface/storage.interface';
import { File, FileDocument } from './schema/file.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FilesService {
  private readonly _s3Client: S3Client;
  private readonly _logger = new Logger(FilesService.name);
  private readonly _bucketName: string;

  constructor(
    @InjectModel(File.name) private readonly _fileModel: Model<FileDocument>,
    @Inject(STORAGE_S3_LIARA_CONST) private readonly storageService: StorageServiceInterface,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(file: Express.Multer.File, userId: string): Promise<FileResponseDto> {
    let s3Key: string | undefined;

    try {
      const { s3Key: uploadedKey, s3Url } = await this.storageService.uploadFile(file, userId);
      s3Key = uploadedKey;

      const createFile = await this._fileModel.create({
        originalName: file.originalname,
        key: s3Key,
        fullUrl: s3Url,
        url: this.configService.getOrThrow<string>('S3_ENDPOINT'),
        mimeType: file.mimetype,
        size: file.size,
        userId,
      });

      this._logger.log(`File metadata saved to DB. File ID: ${createFile._id}`);
      return plainToInstance(FileResponseDto, createFile.toObject());
    } catch (error) {
      this._logger.error(`File upload process failed for user '${userId}'`, error.stack);

      if (s3Key) {
        this._logger.warn(`Triggering compensating action: Deleting S3 file '${s3Key}'`);
        await this.storageService.deleteFile(s3Key).catch((deleteError) => {
          this._logger.error(
            `CRITICAL: Failed to delete orphaned S3 object with key: ${s3Key}`,
            deleteError.stack,
          );
        });
      }

      throw new InternalServerErrorException('خطا در آپلود فایل.');
    }
  }
}
