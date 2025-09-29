import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { OrderStatus } from '../../../common/enums/order-status.enum';
import { PaymentStatus } from '../../../common/enums/payment-status.enum';

export type OrderDocument = Order & Document;

class OrderSelectedOption {
  @Prop({ required: true }) optionName: string;
  @Prop({ required: true }) valueName: string;
}
const OrderSelectedOptionSchema = SchemaFactory.createForClass(OrderSelectedOption);

class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true }) productId: Types.ObjectId;
  @Prop({ required: true }) productName: string;
  @Prop({ required: true, min: 1 }) quantity: number;
  @Prop({ required: true, min: 0 }) unitPrice: number;
  @Prop({ required: true, min: 0 }) totalItemPrice: number;
  @Prop({ type: [OrderSelectedOptionSchema], default: [] }) selectedOptions?: OrderSelectedOption[];
  @Prop({ type: Object, default: null }) pricingSchemeSnapshot?: any;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

class PaymentInfo {
  @Prop({
    type: String,
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Prop() method?: string;
  @Prop() transactionId?: string;
  @Prop() paidAt?: Date;
}
const PaymentInfoSchema = SchemaFactory.createForClass(PaymentInfo);

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true }) orderNumber: string;
  @Prop({ type: Types.ObjectId, ref: 'User', required: true }) userId: Types.ObjectId;
  @Prop({ type: [OrderItemSchema], required: true }) items: OrderItem[];
  @Prop({ required: true }) totalAmount: number;
  @Prop({ type: Object }) shippingAddress?: any;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING_PAYMENT,
  })
  orderStatus: OrderStatus;

  @Prop({ type: PaymentInfoSchema, default: () => ({}) }) paymentInfo?: PaymentInfo;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
