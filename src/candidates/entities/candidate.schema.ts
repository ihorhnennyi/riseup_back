import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Candidate extends Document {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop() middleName: string;
  @Prop() email: string;
  @Prop() phone: string;
  @Prop() age: number;
  @Prop() position: string;
  @Prop() salary: number;
  @Prop({ type: Types.ObjectId, ref: 'City' }) city: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Source' }) source: Types.ObjectId;
  @Prop() description: string;
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' }) createdBy: Types.ObjectId;
  @Prop({ required: true, type: Types.ObjectId, ref: 'Status' }) status: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: 'Status' }) callbackStatus: Types.ObjectId;
  @Prop() callbackDescription: string;
  @Prop() employmentType: string;
  @Prop() gender: string;
  @Prop() interviewDate: Date;
  @Prop({ type: Types.ObjectId, ref: 'Integration' }) integrationId: Types.ObjectId;
  @Prop({ default: true }) isActive: boolean;
  @Prop() resumeUrl: string;
  @Prop({ type: Types.ObjectId, ref: 'User' }) assignedRecruiter: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export const CandidateSchema = SchemaFactory.createForClass(Candidate); 