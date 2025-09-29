import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  orderId: Types.ObjectId;

  @Prop({ required: true })
  amount: number;

  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.STARTED,
  })
  status: PaymentStatus;

  @Prop()
  transactionId?: string;

  @Prop()
  gateway?: string;

  @Prop({ type: Object, default: () => ({}) })
  meta?: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
