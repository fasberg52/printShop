import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { OtpActionEnum } from '../enum/otp.enum';


export type OtpDocument = Otp & Document;


@Schema({ timestamps: true })
export class Otp extends Document {
  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  code: string; 

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ required: true, enum: OtpActionEnum }) 
  action: OtpActionEnum;

  @Prop({ required: true })
  ip: string; 

  @Prop()
  userAgent: string; 
}

export const OtpSchema = SchemaFactory.createForClass(Otp);



OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
