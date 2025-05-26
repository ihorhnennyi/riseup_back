import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Status extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop()
  color: string;

  @Prop({ default: false })
  isDefault: boolean;

  @Prop()
  type: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status); 