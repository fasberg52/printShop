import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TariffsDocument = Tariffs & Document;

@Schema({ _id: false })
export class Tier {
  @Prop({ required: true, min: 1 })
  minQuantity: number;

  @Prop({ required: true, min: 1 })
  maxQuantity: number;

  @Prop({ required: true, min: 0 })
  pricePerUnit: number;
}
export const TierSchema = SchemaFactory.createForClass(Tier);

@Schema({ timestamps: true })
export class Tariffs {
  @Prop({ required: true })
  schemeName: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  unit: string;

  @Prop({ type: [TierSchema], required: true })
  tiers: Tier[];

  @Prop({ default: 1 })
  version?: number;

  @Prop({ type: Date, default: null })
  effectiveFrom?: Date;

  @Prop({ type: Date, default: null })
  effectiveTo?: Date | null;

  @Prop({ type: Boolean, default: true })
  isActive?: boolean;
}

export const TariffsSchema = SchemaFactory.createForClass(Tariffs);
