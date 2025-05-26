"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const employment_type_enum_1 = require("../../common/enums/employment-type.enum");
const role_enum_1 = require("../../common/enums/role.enum");
const work_schedule_enum_1 = require("../../common/enums/work-schedule.enum");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Іван',
        description: 'Ім\'я користувача'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Петренко',
        description: 'Прізвище користувача'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Олександрович',
        description: 'По батькові користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email користувача (має бути унікальним)'
    }),
    (0, class_validator_1.IsEmail)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380501234567',
        description: 'Номер телефону користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.Matches)(/^\+?[1-9]\d{1,14}$/, {
        message: 'Некоректний формат номера телефону'
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'password123',
        description: 'Пароль користувача (мінімум 6 символів)',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380501234567',
        description: 'Viber користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "viber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380501234567',
        description: 'WhatsApp користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user.name',
        description: 'Facebook користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '@username',
        description: 'Telegram користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "telegram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: role_enum_1.UserRole,
        example: role_enum_1.UserRole.RECRUITER,
        description: 'Роль користувача в системі'
    }),
    (0, class_validator_1.IsEnum)(role_enum_1.UserRole),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Досвідчений рекрутер з 5-річним стажем',
        description: 'Опис користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Старший рекрутер',
        description: 'Посада користувача',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1990-05-15',
        description: 'Дата народження користувача',
        required: false
    }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Чи активний користувач',
        default: true,
        required: false
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateUserDto.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'ID міста, де знаходиться користувач'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'ID філії, де працює користувач'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/photo.jpg',
        description: 'URL фотографії користувача',
        required: false
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Українська', 'English'],
        description: 'Мови, якими володіє користувач',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['ATS', 'LinkedIn Recruiter'],
        description: 'Інструменти та навички',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: work_schedule_enum_1.WorkSchedule,
        example: work_schedule_enum_1.WorkSchedule.FULL_TIME,
        description: 'Графік роботи',
        required: false
    }),
    (0, class_validator_1.IsEnum)(work_schedule_enum_1.WorkSchedule),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "workSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: employment_type_enum_1.EmploymentType,
        example: employment_type_enum_1.EmploymentType.FULL_TIME,
        description: 'Формат роботи',
        required: false
    }),
    (0, class_validator_1.IsEnum)(employment_type_enum_1.EmploymentType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-15',
        description: 'Дата початку роботи',
        required: false
    }),
    (0, class_validator_1.IsISO8601)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: 'Досвід роботи (в роках)',
        required: false
    }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "experienceYears", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['IT', 'Banking'],
        description: 'Спеціалізація (домени рекрутингу)',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "specializations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://www.linkedin.com/in/username',
        description: 'Посилання на профіль LinkedIn',
        required: false
    }),
    (0, class_validator_1.IsUrl)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'UA123456789',
        description: 'Номер паспорту або ID-картки',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "identificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Recruiting Certificate'],
        description: 'Сертифікати та досягнення',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "certificates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Олена Петрова',
        description: 'Керівник',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "supervisor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Проведення співбесід'],
        description: 'Обов\'язки та зона відповідальності',
        required: false
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateUserDto.prototype, "responsibilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Emergency contact info',
        description: 'Контактна особа для екстрених випадків',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "emergencyContact", void 0);
//# sourceMappingURL=create-user.dto.js.map