import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type IntegrationDocument = Integration & Document;

@Schema()
export class Integration {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  url: string;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration);
