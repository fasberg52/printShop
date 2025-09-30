import { Exclude, Expose, Transform, Type } from 'class-transformer';

@Exclude()
export class BaseResponseDto {
  @Expose()
  @Transform(({ obj }) => (obj && obj._id ? obj._id.toString() : null))
  _id: string;

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;
}
