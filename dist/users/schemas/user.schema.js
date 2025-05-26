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
exports.UserSchema = exports.User = exports.EmploymentType = exports.WorkSchedule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
const mongoose_2 = require("mongoose");
const branch_schema_1 = require("../../branches/schemas/branch.schema");
const city_schema_1 = require("../../cities/schemas/city.schema");
const role_enum_1 = require("../../common/enums/role.enum");
var WorkSchedule;
(function (WorkSchedule) {
    WorkSchedule["FULL_TIME"] = "FULL_TIME";
    WorkSchedule["PART_TIME"] = "PART_TIME";
    WorkSchedule["FLEXIBLE"] = "FLEXIBLE";
})(WorkSchedule || (exports.WorkSchedule = WorkSchedule = {}));
var EmploymentType;
(function (EmploymentType) {
    EmploymentType["OFFICE"] = "OFFICE";
    EmploymentType["REMOTE"] = "REMOTE";
    EmploymentType["HYBRID"] = "HYBRID";
})(EmploymentType || (exports.EmploymentType = EmploymentType = {}));
let User = class User {
};
exports.User = User;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'Унікальний ідентифікатор користувача'
    }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Іван',
        description: 'Ім\'я користувача'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Петренко',
        description: 'Прізвище користувача'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Олександрович',
        description: 'По батькові користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "middleName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user@example.com',
        description: 'Email користувача (використовується для входу)'
    }),
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380501234567',
        description: 'Номер телефону користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380501234567',
        description: 'Viber користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "viber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '+380501234567',
        description: 'WhatsApp користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "whatsapp", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'user.name',
        description: 'Facebook користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "facebook", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '@username',
        description: 'Telegram користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "telegram", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: role_enum_1.UserRole,
        example: role_enum_1.UserRole.RECRUITER,
        description: 'Роль користувача в системі'
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: role_enum_1.UserRole,
        default: role_enum_1.UserRole.RECRUITER,
        required: true
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Досвідчений рекрутер з 5-річним стажем',
        description: 'Опис користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Старший рекрутер',
        description: 'Посада користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "position", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '1990-05-15',
        description: 'Дата народження користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "birthDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 30,
        description: 'Вік користувача (розраховується автоматично)'
    }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Чи активний користувач (можливість входу в систему)'
    }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'ID міста, де знаходиться користувач'
    }),
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: city_schema_1.City.name,
        required: true
    }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], User.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '507f1f77bcf86cd799439011',
        description: 'ID філії, де працює користувач'
    }),
    (0, mongoose_1.Prop)({
        type: mongoose_2.Schema.Types.ObjectId,
        ref: branch_schema_1.Branch.name,
        required: true
    }),
    __metadata("design:type", mongoose_2.Schema.Types.ObjectId)
], User.prototype, "branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://example.com/photo.jpg',
        description: 'URL фотографії користувача'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "photoUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2024-03-20T10:00:00Z',
        description: 'Дата останнього входу в систему'
    }),
    (0, mongoose_1.Prop)({ type: Date, default: null }),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "refreshToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "passwordResetToken", void 0);
__decorate([
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", Date)
], User.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Українська, English, Русский',
        description: 'Мови, якими володіє користувач'
    }),
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], User.prototype, "languages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['ATS', 'LinkedIn Recruiter', 'Jira'],
        description: 'Інструменти та навички'
    }),
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], User.prototype, "skills", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: WorkSchedule,
        example: WorkSchedule.FULL_TIME,
        description: 'Графік роботи'
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: WorkSchedule,
        default: WorkSchedule.FULL_TIME
    }),
    __metadata("design:type", String)
], User.prototype, "workSchedule", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: EmploymentType,
        example: EmploymentType.OFFICE,
        description: 'Формат роботи'
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: EmploymentType,
        default: EmploymentType.OFFICE
    }),
    __metadata("design:type", String)
], User.prototype, "employmentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '2023-01-15',
        description: 'Дата початку роботи'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 3,
        description: 'Досвід роботи (в роках)'
    }),
    (0, mongoose_1.Prop)({ type: Number, min: 0 }),
    __metadata("design:type", Number)
], User.prototype, "experienceYears", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['IT', 'Banking', 'E-commerce'],
        description: 'Спеціалізація (домени рекрутингу)'
    }),
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], User.prototype, "specializations", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://www.linkedin.com/in/username',
        description: 'Посилання на профіль LinkedIn'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "linkedinUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'UA123456789',
        description: 'Номер паспорту або ID-картки'
    }),
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "identificationNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Recruiting', 'Interviewing', 'Employer Branding'],
        description: 'Сертифікати та досягнення'
    }),
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], User.prototype, "certificates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Олена Петрова',
        description: 'Керівник'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "supervisor", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Проведення співбесід', 'Пошук кандидатів'],
        description: 'Обов\'язки та зона відповідальності'
    }),
    (0, mongoose_1.Prop)([String]),
    __metadata("design:type", Array)
], User.prototype, "responsibilities", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Emergency contact info',
        description: 'Контактна особа для екстрених випадків'
    }),
    (0, mongoose_1.Prop)({ select: false }),
    __metadata("design:type", String)
], User.prototype, "emergencyContact", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: ['Google Calendar', 'Dark theme'],
        description: 'Персональні налаштування користувача'
    }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], User.prototype, "preferences", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({
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
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
exports.UserSchema.virtual('age').get(function () {
    if (!this.birthDate)
        return null;
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
});
//# sourceMappingURL=user.schema.js.map