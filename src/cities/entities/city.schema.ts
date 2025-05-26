import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({ timestamps: true })
export class City extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop()
  latitude: number;

  @Prop()
  longitude: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const CitySchema = SchemaFactory.createForClass(City); 