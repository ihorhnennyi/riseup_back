import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Source extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description?: string;
}

export const SourceSchema = SchemaFactory.createForClass(Source); 