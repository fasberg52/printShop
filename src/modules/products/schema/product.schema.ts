import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

class OptionValue {
  @Prop({ required: true })
  valueName: string;

  // per-unit additional cost
  @Prop({ type: Number, default: 0 })
  additionalCostPerUnit?: number;
}
const OptionValueSchema = SchemaFactory.createForClass(OptionValue);

class ConfigOption {
  @Prop({ required: true })
  optionName: string;

  @Prop({ enum: ['radio', 'select', 'number', 'checkbox'], default: 'radio' })
  controlType: string;

  @Prop({ type: [OptionValueSchema], default: [] })
  values: OptionValue[];
}
const ConfigOptionSchema = SchemaFactory.createForClass(ConfigOption);

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop()
  description?: string;

  @Prop({ default: true })
  isActive?: boolean;

  @Prop({ type: Types.ObjectId, ref: 'PricingScheme' })
  pricingSchemeId?: Types.ObjectId;

  @Prop({ type: [ConfigOptionSchema], default: [] })
  configurableOptions?: ConfigOption[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
