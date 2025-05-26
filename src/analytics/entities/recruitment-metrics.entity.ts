import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class RecruitmentMetrics extends Document {
  @Prop({ required: true, type: Types.ObjectId, ref: 'User' })
  recruiterId: Types.ObjectId;

  @Prop({ required: true })
  period: string; // 'daily', 'weekly', 'monthly'

  @Prop({ required: true })
  date: Date;

  // Общие метрики
  @Prop({ default: 0 })
  totalCandidates: number;

  @Prop({ default: 0 })
  newCandidates: number;

  @Prop({ default: 0 })
  interviewsScheduled: number;

  @Prop({ default: 0 })
  interviewsCompleted: number;

  @Prop({ default: 0 })
  offersMade: number;

  @Prop({ default: 0 })
  offersAccepted: number;

  // Метрики по времени
  @Prop({ default: 0 })
  averageTimeToFirstInterview: number; // в часах

  @Prop({ default: 0 })
  averageTimeToOffer: number; // в часах

  @Prop({ default: 0 })
  averageTimeToHire: number; // в часах

  // Метрики по источникам
  @Prop({ type: Object })
  sourceMetrics: {
    [key: string]: {
      total: number;
      hired: number;
      conversionRate: number;
    };
  };

  // Метрики по статусам
  @Prop({ type: Object })
  statusMetrics: {
    [key: string]: number;
  };

  // Метрики по городам
  @Prop({ type: Object })
  cityMetrics: {
    [key: string]: number;
  };

  // Метрики по вакансиям
  @Prop({ type: Object })
  positionMetrics: {
    [key: string]: {
      total: number;
      hired: number;
      averageTimeToHire: number;
    };
  };
}

export const RecruitmentMetricsSchema = SchemaFactory.createForClass(RecruitmentMetrics); 