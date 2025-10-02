import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminTariffsController } from './controllers/admin-tariffs.controller';
import { TariffsController } from './controllers/tariffs.controller';
import { Tariffs, TariffsSchema } from './schema/tariffs.schema';
import { TariffsService } from './tariffs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Tariffs.name, schema: TariffsSchema }])],
  controllers: [TariffsController, AdminTariffsController],
  providers: [TariffsService],
  exports: [MongooseModule],
})
export class TariffsModule {}
