import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Integration extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  url: string;

  @Prop()
  description: string;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration); 