import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDefined,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { TariffConfigurationDto } from './tariff.configraton.dto';

export class CreateTariffDto {
  @ApiProperty({ example: 'print-prices-fall-2025' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'تعرفه چاپ دیجیتال برای پاییز ۱۴۰۴' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ type: TariffConfigurationDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested() //  این دکوراتور باعث می‌شود کلاس تودرتو نیز اعتبارسنجی شود
  @Type(() => TariffConfigurationDto) //  این دکوراتور برای تبدیل plain object به کلاس لازم است
  configuration: TariffConfigurationDto;
}
