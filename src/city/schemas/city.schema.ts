import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CityDocument = City & Document;

@Schema()
export class City {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;
}

export const CitySchema = SchemaFactory.createForClass(City);
