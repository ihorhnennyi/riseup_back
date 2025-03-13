import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type LeadDocument = Lead & Document;

@Schema({ timestamps: true })
export class Lead {
  @Prop({ type: Types.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  surname: string;

  @Prop()
  middleName?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  @Prop()
  age: number;

  @Prop()
  photo?: string;

  @Prop()
  telegram?: string;

  @Prop({ type: [String], default: [] })
  skills: string[];

  @Prop({ type: [String], default: [] })
  workSchedule: string[];

  @Prop()
  salaryExpectation?: number;

  @Prop({ default: false })
  relocation: boolean;

  @Prop({ default: true })
  remoteWork: boolean;

  @Prop({ type: [String], default: [] })
  portfolio: string[];

  @Prop()
  notes?: string;

  // ✅ Исправляем `statusId`
  @Prop({ type: Types.ObjectId, ref: 'Status' })
  statusId: Types.ObjectId;

  @Prop({ type: Date, required: false })
  statusEndDate?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  recruiter: Types.ObjectId;
}

export const LeadSchema = SchemaFactory.createForClass(Lead);
