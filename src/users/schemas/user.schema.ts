import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { ApiProperty } from '@nestjs/swagger'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { Branch } from '../../branches/schemas/branch.schema'
import { City } from '../../cities/schemas/city.schema'
import { UserRole } from '../../common/enums/role.enum'

export enum WorkSchedule {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  FLEXIBLE = 'FLEXIBLE'
}

export enum EmploymentType {
  OFFICE = 'OFFICE',
  REMOTE = 'REMOTE',
  HYBRID = 'HYBRID'
}

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  versionKey: false,
  toJSON: {
    virtuals: true,
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class User {
  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'Унікальний ідентифікатор користувача'
  })
  id: string;

  @ApiProperty({ 
    example: 'Іван',
    description: 'Ім\'я користувача'
  })
  @Prop({ required: true })
  firstName: string;

  @ApiProperty({ 
    example: 'Петренко',
    description: 'Прізвище користувача'
  })
  @Prop({ required: true })
  lastName: string;

  @ApiProperty({ 
    example: 'Олександрович',
    description: 'По батькові користувача'
  })
  @Prop()
  middleName?: string;

  @ApiProperty({ 
    example: 'user@example.com',
    description: 'Email користувача (використовується для входу)'
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ 
    example: '+380501234567',
    description: 'Номер телефону користувача'
  })
  @Prop()
  phone?: string;

  @Prop({ required: true, select: false })
  password: string;

  @ApiProperty({ 
    example: '+380501234567',
    description: 'Viber користувача'
  })
  @Prop()
  viber?: string;

  @ApiProperty({ 
    example: '+380501234567',
    description: 'WhatsApp користувача'
  })
  @Prop()
  whatsapp?: string;

  @ApiProperty({ 
    example: 'user.name',
    description: 'Facebook користувача'
  })
  @Prop()
  facebook?: string;

  @ApiProperty({ 
    example: '@username',
    description: 'Telegram користувача'
  })
  @Prop()
  telegram?: string;

  @ApiProperty({ 
    enum: UserRole,
    example: UserRole.RECRUITER,
    description: 'Роль користувача в системі'
  })
  @Prop({ 
    type: String, 
    enum: UserRole, 
    default: UserRole.RECRUITER,
    required: true 
  })
  role: UserRole;

  @ApiProperty({ 
    example: 'Досвідчений рекрутер з 5-річним стажем',
    description: 'Опис користувача'
  })
  @Prop()
  description?: string;

  @ApiProperty({ 
    example: 'Старший рекрутер',
    description: 'Посада користувача'
  })
  @Prop()
  position?: string;

  @ApiProperty({ 
    example: '1990-05-15',
    description: 'Дата народження користувача'
  })
  @Prop()
  birthDate?: Date;

  @ApiProperty({ 
    example: 30,
    description: 'Вік користувача (розраховується автоматично)'
  })
  age?: number;

  @ApiProperty({ 
    example: true,
    description: 'Чи активний користувач (можливість входу в систему)'
  })
  @Prop({ default: true })
  isActive: boolean;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'ID міста, де знаходиться користувач'
  })
  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: City.name,
    required: true 
  })
  city: MongooseSchema.Types.ObjectId;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'ID філії, де працює користувач'
  })
  @Prop({ 
    type: MongooseSchema.Types.ObjectId, 
    ref: Branch.name,
    required: true 
  })
  branch: MongooseSchema.Types.ObjectId;

  @ApiProperty({ 
    example: 'https://example.com/photo.jpg',
    description: 'URL фотографії користувача'
  })
  @Prop()
  photoUrl?: string;

  @ApiProperty({ 
    example: '2024-03-20T10:00:00Z',
    description: 'Дата останнього входу в систему'
  })
  @Prop({ type: Date, default: null })
  lastLogin?: Date;

  @Prop({ select: false })
  refreshToken?: string;

  @Prop({ select: false })
  passwordResetToken?: string;

  @Prop({ select: false })
  passwordResetExpires?: Date;

  @ApiProperty({ 
    example: 'Українська, English, Русский',
    description: 'Мови, якими володіє користувач'
  })
  @Prop([String])
  languages?: string[];

  @ApiProperty({ 
    example: ['ATS', 'LinkedIn Recruiter', 'Jira'],
    description: 'Інструменти та навички'
  })
  @Prop([String])
  skills?: string[];

  @ApiProperty({ 
    enum: WorkSchedule,
    example: WorkSchedule.FULL_TIME,
    description: 'Графік роботи'
  })
  @Prop({ 
    type: String, 
    enum: WorkSchedule,
    default: WorkSchedule.FULL_TIME 
  })
  workSchedule: WorkSchedule;

  @ApiProperty({ 
    enum: EmploymentType,
    example: EmploymentType.OFFICE,
    description: 'Формат роботи'
  })
  @Prop({ 
    type: String, 
    enum: EmploymentType,
    default: EmploymentType.OFFICE 
  })
  employmentType: EmploymentType;

  @ApiProperty({ 
    example: '2023-01-15',
    description: 'Дата початку роботи'
  })
  @Prop()
  startDate?: Date;

  @ApiProperty({ 
    example: 3,
    description: 'Досвід роботи (в роках)'
  })
  @Prop({ type: Number, min: 0 })
  experienceYears?: number;

  @ApiProperty({ 
    example: ['IT', 'Banking', 'E-commerce'],
    description: 'Спеціалізація (домени рекрутингу)'
  })
  @Prop([String])
  specializations?: string[];

  @ApiProperty({ 
    example: 'https://www.linkedin.com/in/username',
    description: 'Посилання на профіль LinkedIn'
  })
  @Prop()
  linkedinUrl?: string;

  @ApiProperty({ 
    example: 'UA123456789',
    description: 'Номер паспорту або ID-картки'
  })
  @Prop({ select: false }) // Чувствительные данные, не включаются в обычные запросы
  identificationNumber?: string;

  @ApiProperty({ 
    example: ['Recruiting', 'Interviewing', 'Employer Branding'],
    description: 'Сертифікати та досягнення'
  })
  @Prop([String])
  certificates?: string[];

  @ApiProperty({ 
    example: 'Олена Петрова',
    description: 'Керівник'
  })
  @Prop()
  supervisor?: string;

  @ApiProperty({ 
    example: ['Проведення співбесід', 'Пошук кандидатів'],
    description: 'Обов\'язки та зона відповідальності'
  })
  @Prop([String])
  responsibilities?: string[];

  @ApiProperty({ 
    example: 'Emergency contact info',
    description: 'Контактна особа для екстрених випадків'
  })
  @Prop({ select: false }) // Чувствительные данные
  emergencyContact?: string;

  @ApiProperty({ 
    example: ['Google Calendar', 'Dark theme'],
    description: 'Персональні налаштування користувача'
  })
  @Prop({ type: MongooseSchema.Types.Mixed })
  preferences?: Record<string, any>;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Добавляем виртуальное поле для расчета возраста
UserSchema.virtual('age').get(function() {
  if (!this.birthDate) return null;
  
  const today = new Date();
  const birthDate = new Date(this.birthDate);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}); 