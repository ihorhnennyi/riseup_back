import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document } from 'mongoose'

export type CityDocument = City & Document;

@Schema({
  timestamps: true,
  versionKey: false,
})
export class City {
  @ApiProperty({ example: 'New York' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 40.7128 })
  @Prop()
  latitude?: number;

  @ApiProperty({ example: -74.0060 })
  @Prop()
  longitude?: number;

  @ApiProperty({ example: true })
  @Prop({ default: true })
  isActive: boolean;
}

export const CitySchema = SchemaFactory.createForClass(City); 