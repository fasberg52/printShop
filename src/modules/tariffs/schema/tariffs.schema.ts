import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import type { TariffConfigurationInterface } from '../interface/tariffs.interface';

export type TariffsDocument = Tariffs & Document;

@Schema({ timestamps: true })
export class Tariffs {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description?: string;

  @Prop({ type: Object, required: true })
  configuration: TariffConfigurationInterface;

  @Prop({ default: 1 })
  version?: number;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;
}

export const TariffsSchema = SchemaFactory.createForClass(Tariffs);
