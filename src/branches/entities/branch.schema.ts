import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Branch extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true })
  city: Types.ObjectId;

  @Prop()
  description: string;

  @Prop()
  address: string;

  @Prop()
  phone: string;

  @Prop()
  email: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const BranchSchema = SchemaFactory.createForClass(Branch); 