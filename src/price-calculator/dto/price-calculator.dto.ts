import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsIn,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

// کلاس تودرتو برای اطلاعات صحافی
class BindingDto {
  @ApiProperty({ example: 'spring_papco', description: 'نوع صحافی' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ example: 'black_and_white', description: 'رنگ جلد (اختیاری)' })
  @IsString()
  @IsOptional()
  coverColor?: string;
}

// DTO اصلی برای بدنه درخواست
export class PriceCalculatorDto {
  @ApiProperty({ example: 'a5', description: 'اندازه کاغذ' })
  @IsIn(['a3', 'a4', 'a5'])
  size: string;

  @ApiProperty({ example: 'black_and_white', description: 'نوع رنگ چاپ' })
  @IsIn(['black_and_white', 'normalColor', 'fullColor'])
  color: string;

  @ApiProperty({ example: 'double_sided', description: 'یک رو یا دو رو بودن چاپ' })
  @IsIn(['single_sided', 'double_sided'])
  side: string;

  @ApiProperty({ example: 100, description: 'تعداد کل برگه‌ها' })
  @IsNumber()
  @Min(1)
  countOfPages: number;

  @ApiProperty({ example: 1, description: 'تعداد نسخه‌ها' })
  @IsNumber()
  @Min(1)
  countOfCopies: number;

  @ApiPropertyOptional({ type: BindingDto, description: 'اطلاعات صحافی (اختیاری)' })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => BindingDto)
  @IsOptional()
  binding?: BindingDto;
}
