import { IsString, IsOptional, IsArray, ArrayMinSize } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  configurableOptions?: any[];
}
