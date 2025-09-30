import { Exclude, Expose } from 'class-transformer';
import { BaseResponseDto } from 'src/dto/base.response.dto';

@Exclude()
export class UserResponseDto extends BaseResponseDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  phone: string;

  @Expose()
  roles: string[];
}
