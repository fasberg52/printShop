import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, Length } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({
    example: '09123456789',
    description: 'شماره تماسی که کد برای آن ارسال شده است',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IR')
  phone: string;

  @ApiProperty({
    example: '12345',
    description: 'کد ۵ رقمی تایید که از طریق پیامک دریافت شده است',
  })
  @IsString()
  @Length(5, 5, { message: 'کد تایید باید ۵ رقمی باشد' })
  code: string;
}
