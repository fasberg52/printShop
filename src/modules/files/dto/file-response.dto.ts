import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class FileResponseDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;

  @Expose()
  originalName: string;

  @Expose()
  url: string;

  @Expose()
  fullUrl: string;

  @Expose()
  mimeType: string;

  @Expose()
  size: number;

  @Expose()
  @Transform(({ obj }) => obj.userId?.toString())
  userId: string;

  @Expose()
  createdAt: Date;
}
