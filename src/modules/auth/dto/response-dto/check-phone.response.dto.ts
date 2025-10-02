import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CheckPhoneResponseDto {
  @ApiProperty({ description: 'آیا کاربری با این شماره تلفن وجود دارد یا خیر' })
  @Expose()
  userExists: boolean;
}
