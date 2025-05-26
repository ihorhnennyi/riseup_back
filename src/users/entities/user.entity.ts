import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Types } from 'mongoose'
import { EmploymentType } from '../../common/enums/employment-type.enum'
import { UserRole } from '../../common/enums/role.enum'
import { WorkSchedule } from '../../common/enums/work-schedule.enum'

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  middleName?: string;

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.RECRUITER,
  })
  role: UserRole;

  @Prop({ type: Types.ObjectId, ref: 'City', required: true })
  city: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branch: Types.ObjectId;

  @Prop({
    type: String,
    enum: WorkSchedule,
  })
  workSchedule: WorkSchedule;

  @Prop({
    type: String,
    enum: EmploymentType,
  })
  employmentType: EmploymentType;

  @Prop()
  refreshToken: string;

  @Prop()
  lastLogin: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isEmailVerified: boolean;

  @Prop([String])
  languages?: string[];

  @Prop([String])
  skills?: string[];

  @Prop([String])
  specializations?: string[];

  @Prop([String])
  certificates?: string[];

  @Prop([String])
  responsibilities?: string[];

  @Prop()
  viber?: string;

  @Prop()
  whatsapp?: string;

  @Prop()
  facebook?: string;

  @Prop()
  telegram?: string;

  @Prop()
  description?: string;

  @Prop()
  position?: string;

  @Prop()
  birthDate?: Date;

  @Prop()
  photoUrl?: string;

  @Prop()
  linkedinUrl?: string;

  @Prop()
  identificationNumber?: string;

  @Prop()
  supervisor?: string;

  @Prop()
  emergencyContact?: string;

  @Prop()
  startDate?: Date;

  @Prop()
  experienceYears?: number;
}

export const UserSchema = SchemaFactory.createForClass(User); 