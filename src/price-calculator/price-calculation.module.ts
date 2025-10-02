import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/modules/products/products.module';
import { TariffsModule } from 'src/modules/tariffs/tariffs.module';
import { PriceCalculatorController } from './price-calculation.controller';
import { PriceCalculationService } from './price-calculation.service';

@Module({
  imports: [TariffsModule, ProductsModule],
  controllers: [PriceCalculatorController],
  providers: [PriceCalculationService],
})
export class PriceCalculatorModule {}
