import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../../enum/user-role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: false })
  lastName: string;

  @Prop({ required: false })
  middleName?: string;

  @Prop({ required: false })
  birthDate: Date;

  @Prop({ required: false, unique: true })
  phone: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  telegram?: string;

  @Prop({ required: false })
  whatsapp?: string;

  @Prop({ required: false })
  viber?: string;

  @Prop({ required: false })
  facebook?: string;

  @Prop({ required: false })
  photo?: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: String, ref: 'City' }] })
  cities: string[];

  @Prop({ type: [{ type: String, ref: 'Branch' }] })
  branches: string[];

  @Prop({ type: [{ type: String, ref: 'Lead' }] })
  leads: string[];

  @Prop({ type: [{ type: Object }] })
  integrations: { type: string; login: string; password: string }[];

  @Prop()
  refreshToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
