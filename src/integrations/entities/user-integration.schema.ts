import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class UserIntegration extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Integration', required: true })
  integrationId: Types.ObjectId;
}

export const UserIntegrationSchema = SchemaFactory.createForClass(UserIntegration); 