import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { UserRole } from '../../enum/user-role.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ type: Types.ObjectId, auto: true }) // ✅ Теперь MongoDB сам создает _id
  _id?: Types.ObjectId;

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

  @Prop({ required: true, enum: UserRole, default: UserRole.RECRUITER })
  role: UserRole;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [{ type: String, ref: 'City' }] })
  cities: string[];

  @Prop({ type: [{ type: String, ref: 'Branch' }] })
  branches: string[];

  @Prop({ type: [{ type: Object }] })
  integrations: { type: string; login: string; password: string }[];

  @Prop({ type: String, ref: 'Branch', required: false })
  branch?: string;

  @Prop()
  refreshToken?: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lead' }] })
  leads: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
