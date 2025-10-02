import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsInt,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';

// --- زیرمجموعه تعرفه پرینت ---

class BreakpointDto {
  @ApiProperty({ description: 'تعداد شروع رنج', example: 501 })
  @IsInt()
  @Min(1)
  at: number;

  @ApiProperty({ description: 'قیمت یک رو', example: 4000 })
  @IsNumber()
  singleSided: number;

  @ApiProperty({ description: 'قیمت دو رو', example: 5800 })
  @IsNumber()
  doubleSided: number;

  @ApiPropertyOptional({ description: 'قیمت یک رو گلاسه', example: 4200 })
  @IsNumber()
  @IsOptional()
  singleSidedGlossy?: number;

  @ApiPropertyOptional({ description: 'قیمت دو رو گلاسه', example: 5700 })
  @IsNumber()
  @IsOptional()
  doubleSidedGlossy?: number;
}

class PrintOptionDto {
  @ApiProperty({ description: 'قیمت پایه یک رو', example: 4200 })
  @IsNumber()
  singleSided: number;

  @ApiProperty({ description: 'قیمت پایه دو رو', example: 6000 })
  @IsNumber()
  doubleSided: number;

  @ApiPropertyOptional({ description: 'قیمت پایه یک رو گلاسه', example: 5500 })
  @IsNumber()
  @IsOptional()
  singleSidedGlossy?: number;

  @ApiPropertyOptional({ description: 'قیمت پایه دو رو گلاسه', example: 7400 })
  @IsNumber()
  @IsOptional()
  doubleSidedGlossy?: number;

  @ApiPropertyOptional({ type: [BreakpointDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BreakpointDto)
  @IsOptional()
  breakpoints?: BreakpointDto[];
}

class PrintSizeDto {
  @ApiPropertyOptional({ type: PrintOptionDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PrintOptionDto)
  @IsOptional()
  fullColor?: PrintOptionDto;

  @ApiPropertyOptional({ type: PrintOptionDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PrintOptionDto)
  @IsOptional()
  normalColor?: PrintOptionDto;

  @ApiPropertyOptional({ type: PrintOptionDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PrintOptionDto)
  @IsOptional()
  blackAndWhite?: PrintOptionDto;
}

class PrintTariffDto {
  @ApiPropertyOptional({ type: PrintSizeDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PrintSizeDto)
  @IsOptional()
  a3?: PrintSizeDto;

  @ApiPropertyOptional({ type: PrintSizeDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PrintSizeDto)
  @IsOptional()
  a4?: PrintSizeDto;

  @ApiPropertyOptional({ type: PrintSizeDto })
  @IsObject()
  @ValidateNested()
  @Type(() => PrintSizeDto)
  @IsOptional()
  a5?: PrintSizeDto;
}

// --- زیرمجموعه تعرفه صحافی ---

class BindingSizePriceDto {
  @ApiProperty()
  @IsNumber()
  a3: number;

  @ApiProperty()
  @IsNumber()
  a4: number;

  @ApiProperty()
  @IsNumber()
  a5: number;
}

class BindingTariffDto {
  @ApiPropertyOptional({ type: BindingSizePriceDto })
  @IsObject()
  @ValidateNested()
  @Type(() => BindingSizePriceDto)
  @IsOptional()
  springNormal?: BindingSizePriceDto;

  @ApiPropertyOptional({ type: BindingSizePriceDto })
  @IsObject()
  @ValidateNested()
  @Type(() => BindingSizePriceDto)
  @IsOptional()
  springPapco?: BindingSizePriceDto;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  stapler?: number;
}

// --- کلاس اصلی ---
export class TariffConfigurationDto {
  @ApiPropertyOptional({ type: PrintTariffDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => PrintTariffDto)
  @IsOptional()
  print?: PrintTariffDto;

  @ApiPropertyOptional({ type: BindingTariffDto })
  @IsDefined()
  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => BindingTariffDto)
  @IsOptional()
  binding?: BindingTariffDto;
}
