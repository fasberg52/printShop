import { Prop } from '@nestjs/mongoose';

export abstract class Base {
  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ default: null })
  deletedAt?: Date;
}
