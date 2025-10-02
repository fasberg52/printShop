import { ApiProperty } from '@nestjs/swagger';

class PriceDataDto {
  @ApiProperty({ example: 121000 })
  amount: number;
}

export class PriceCalculatorResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ type: PriceDataDto })
  data: PriceDataDto;

  @ApiProperty({ example: null })
  error: any;
}
