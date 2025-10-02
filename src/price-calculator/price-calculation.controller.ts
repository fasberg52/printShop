import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { PriceCalculatorDto } from './dto/price-calculator.dto';
import { PriceCalculatorResponseDto } from './dto/price-calculator-response.dto';
import { PriceCalculationService } from './price-calculation.service';

@ApiTags('Price Calculator')
@Controller('price-calculator')
export class PriceCalculatorController {
  constructor(private readonly _priceCalculationService: PriceCalculationService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'محاسبه قیمت نهایی بر اساس گزینه‌های انتخابی' })
  @ApiResponse({ status: 200, description: 'موفق', type: PriceCalculatorResponseDto })
  @ApiResponse({ status: 400, description: 'داده‌های ورودی نامعتبر است' })
  @ApiResponse({ status: 404, description: 'تعرفه مورد نظر یافت نشد' })
  async calculatePrice(@Body() dto: PriceCalculatorDto): Promise<PriceCalculatorResponseDto> {
    const data = await this._priceCalculationService.calculateTotalPrice(dto);
    return {
      statusCode: 200,
      data,
      error: null,
    };
  }
}
