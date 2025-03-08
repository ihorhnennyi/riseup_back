import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { City } from '../../city/schemas/city.schema';

@Schema()
export class Branch {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true })
  city: City;

  @Prop()
  latitude?: number;

  @Prop()
  longitude?: number;
}

export type BranchDocument = Branch & Document;
export const BranchSchema = SchemaFactory.createForClass(Branch);
