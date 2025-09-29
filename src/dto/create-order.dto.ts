import { IsString, IsArray, IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString() productId: string;
  @IsNumber() quantity: number;
  selectedOptions?: any[];
}

export class CreateOrderDto {
  @IsString() userId: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => OrderItemDto) items: OrderItemDto[];
  shippingAddress?: any;
}
