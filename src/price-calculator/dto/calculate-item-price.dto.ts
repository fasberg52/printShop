import { Type } from 'class-transformer';
import { IsArray, IsMongoId, IsNumber, IsString, Min, ValidateNested } from 'class-validator';
import { SelectedOptionInterface } from '../price-calculation.interface';

class SelectedOptionDto implements SelectedOptionInterface {
  @IsString()
  optionName: string;

  @IsString()
  valueName: string;
}

export class CalculateItemPriceDto {
  @IsMongoId()
  productId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedOptionDto)
  selectedOptions: SelectedOptionDto[];

  @IsNumber()
  @Min(1)
  quantity: number;
}
