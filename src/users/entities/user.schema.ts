import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { EmploymentType } from '../../common/enums/employment-type.enum';
import { UserRole } from '../../common/enums/role.enum';
import { WorkSchedule } from '../../common/enums/work-schedule.enum';

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

  @Prop({
    type: String,
    enum: UserRole,
    default: UserRole.RECRUITER,
  })
  role: UserRole;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'City', required: true })
  city: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true })
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
}

export const UserSchema = SchemaFactory.createForClass(User); 