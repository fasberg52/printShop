export interface StorageServiceInterface {
  uploadFile(file: Express.Multer.File, userId: string): Promise<{ s3Key: string; s3Url: string }>;
  deleteFile(key: string): Promise<void>;
}
