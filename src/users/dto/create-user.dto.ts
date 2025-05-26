import { ApiProperty } from '@nestjs/swagger';
import {
    IsArray,
    IsEmail,
    IsEnum,
    IsISO8601,
    IsMongoId,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUrl,
    Matches,
    Min,
    MinLength
} from 'class-validator';
import { EmploymentType } from '../../common/enums/employment-type.enum';
import { UserRole } from '../../common/enums/role.enum';
import { WorkSchedule } from '../../common/enums/work-schedule.enum';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'Іван',
    description: 'Ім\'я користувача'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ 
    example: 'Петренко',
    description: 'Прізвище користувача'
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ 
    example: 'Олександрович',
    description: 'По батькові користувача',
    required: false
  })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ 
    example: 'user@example.com',
    description: 'Email користувача (має бути унікальним)'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: '+380501234567',
    description: 'Номер телефону користувача',
    required: false
  })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, {
    message: 'Некоректний формат номера телефону'
  })
  @IsOptional()
  phone?: string;

  @ApiProperty({ 
    example: 'password123',
    description: 'Пароль користувача (мінімум 6 символів)',
    required: false
  })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ 
    example: '+380501234567',
    description: 'Viber користувача',
    required: false
  })
  @IsString()
  @IsOptional()
  viber?: string;

  @ApiProperty({ 
    example: '+380501234567',
    description: 'WhatsApp користувача',
    required: false
  })
  @IsString()
  @IsOptional()
  whatsapp?: string;

  @ApiProperty({ 
    example: 'user.name',
    description: 'Facebook користувача',
    required: false
  })
  @IsString()
  @IsOptional()
  facebook?: string;

  @ApiProperty({ 
    example: '@username',
    description: 'Telegram користувача',
    required: false
  })
  @IsString()
  @IsOptional()
  telegram?: string;

  @ApiProperty({ 
    enum: UserRole,
    example: UserRole.RECRUITER,
    description: 'Роль користувача в системі'
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ 
    example: 'Досвідчений рекрутер з 5-річним стажем',
    description: 'Опис користувача',
    required: false
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ 
    example: 'Старший рекрутер',
    description: 'Посада користувача',
    required: false
  })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ 
    example: '1990-05-15',
    description: 'Дата народження користувача',
    required: false
  })
  @IsISO8601()
  @IsOptional()
  birthDate?: string;

  @ApiProperty({ 
    example: true,
    description: 'Чи активний користувач',
    default: true,
    required: false
  })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'ID міста, де знаходиться користувач'
  })
  @IsMongoId()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ 
    example: '507f1f77bcf86cd799439011',
    description: 'ID філії, де працює користувач'
  })
  @IsMongoId()
  @IsNotEmpty()
  branch: string;

  @ApiProperty({ 
    example: 'https://example.com/photo.jpg',
    description: 'URL фотографії користувача',
    required: false
  })
  @IsUrl()
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ 
    example: ['Українська', 'English'],
    description: 'Мови, якими володіє користувач',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  languages?: string[];

  @ApiProperty({ 
    example: ['ATS', 'LinkedIn Recruiter'],
    description: 'Інструменти та навички',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  skills?: string[];

  @ApiProperty({ 
    enum: WorkSchedule,
    example: WorkSchedule.FULL_TIME,
    description: 'Графік роботи',
    required: false
  })
  @IsEnum(WorkSchedule)
  @IsOptional()
  workSchedule?: WorkSchedule;

  @ApiProperty({ 
    enum: EmploymentType,
    example: EmploymentType.FULL_TIME,
    description: 'Формат роботи',
    required: false
  })
  @IsEnum(EmploymentType)
  @IsOptional()
  employmentType?: EmploymentType;

  @ApiProperty({ 
    example: '2023-01-15',
    description: 'Дата початку роботи',
    required: false
  })
  @IsISO8601()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ 
    example: 3,
    description: 'Досвід роботи (в роках)',
    required: false
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  experienceYears?: number;

  @ApiProperty({ 
    example: ['IT', 'Banking'],
    description: 'Спеціалізація (домени рекрутингу)',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  specializations?: string[];

  @ApiProperty({ 
    example: 'https://www.linkedin.com/in/username',
    description: 'Посилання на профіль LinkedIn',
    required: false
  })
  @IsUrl()
  @IsOptional()
  linkedinUrl?: string;

  @ApiProperty({ 
    example: 'UA123456789',
    description: 'Номер паспорту або ID-картки',
    required: false
  })
  @IsString()
  @IsOptional()
  identificationNumber?: string;

  @ApiProperty({ 
    example: ['Recruiting Certificate'],
    description: 'Сертифікати та досягнення',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certificates?: string[];

  @ApiProperty({ 
    example: 'Олена Петрова',
    description: 'Керівник',
    required: false
  })
  @IsString()
  @IsOptional()
  supervisor?: string;

  @ApiProperty({ 
    example: ['Проведення співбесід'],
    description: 'Обов\'язки та зона відповідальності',
    required: false
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  responsibilities?: string[];

  @ApiProperty({ 
    example: 'Emergency contact info',
    description: 'Контактна особа для екстрених випадків',
    required: false
  })
  @IsString()
  @IsOptional()
  emergencyContact?: string;
} 