import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'علی', description: 'نام را وارد کنید' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'ایمانی', description: 'نام خانوادگی را وارد کنید' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: '09123456789',
    description: 'شماره تماس 11 رقمی',
  })
  @IsNotEmpty()
  @IsPhoneNumber('IR')
  phone: string;

  @ApiProperty({ example: 'Password123!', description: 'User password' })
  @IsString()
  @MinLength(6, { message: 'رمز عبور باید 6 رقمی باشد' })
  @IsNotEmpty()
  password: string;
}
