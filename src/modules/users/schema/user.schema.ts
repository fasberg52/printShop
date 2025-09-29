import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { RoleEnum } from 'src/common/enums/roles.enum';
import { Base } from 'src/common/schema/base.schema';


export type UserDocument = User & Document;

class Address {
  @Prop() title?: string;
  @Prop() province?: string;
  @Prop() city?: string;
  @Prop() fullAddress?: string;
  @Prop() postalCode?: string;
  @Prop({ default: false }) isDefault?: boolean;
}
const AddressSchema = SchemaFactory.createForClass(Address);

@Schema({ timestamps: true })
export class User extends Base {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true, unique: true }) phone: string;
  @Prop({ unique: true, sparse: true }) email?: string;
  @Prop({ required: true }) passwordHash: string;
  @Prop({ type: [AddressSchema], default: [] }) addresses?: Address[];
  @Prop({ type: [String], enum: Object.values(RoleEnum), default: [RoleEnum.USER] })
  roles?: RoleEnum[];
}

export const UserSchema = SchemaFactory.createForClass(User);
