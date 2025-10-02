import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CheckPhoneDto {
  @ApiProperty({ example: '09123456789', description: 'شماره تماس کاربر برای استعلام' })
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  phone: string;
}
