import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type StatusDocument = Status & Document;

@Schema()
export class Status {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  color: string;
}

export const StatusSchema = SchemaFactory.createForClass(Status);
