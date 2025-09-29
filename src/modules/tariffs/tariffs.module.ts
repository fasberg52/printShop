import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PriceCalculationService } from '../../services/price-calculation.service';
import { ProductsModule } from '../products/products.module';
import { Tariffs, TariffsSchema } from './schema/tariffs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tariffs.name, schema: TariffsSchema }]),
    ProductsModule,
  ],
  providers: [PriceCalculationService],
  exports: [PriceCalculationService],
})
export class TariffsModule {}
