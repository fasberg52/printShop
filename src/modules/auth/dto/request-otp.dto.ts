import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { OtpActionEnum } from 'src/modules/otp/enum/otp.enum';

export class RequestOtpDto {
  @ApiProperty({ example: '09123456789', description: 'شماره تماس ۱۱ رقمی' })
  @IsNotEmpty()
  @IsPhoneNumber('IR')
  phone: string;

  @ApiProperty({
    enum: OtpActionEnum,
    example: OtpActionEnum.REGISTER,
    description: 'نوع عملیات OTP',
  })
  @IsEnum(OtpActionEnum)
  action: OtpActionEnum;
}
