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
exports.StatusSchema = exports.Status = exports.StatusType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const swagger_1 = require("@nestjs/swagger");
var StatusType;
(function (StatusType) {
    StatusType["INITIAL"] = "initial";
    StatusType["INTERVIEW"] = "interview";
    StatusType["FINAL"] = "final";
    StatusType["OTHER"] = "other";
    StatusType["CALLBACK"] = "callback";
})(StatusType || (exports.StatusType = StatusType = {}));
let Status = class Status {
};
exports.Status = Status;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'На розгляді',
        description: 'Назва статусу кандидата'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Status.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#FFD700',
        description: 'Колір статусу в HEX форматі'
    }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Status.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Кандидат знаходиться на етапі розгляду резюме',
        description: 'Детальний опис статусу'
    }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Status.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: 'Порядковий номер для сортування'
    }),
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Status.prototype, "order", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        enum: StatusType,
        example: StatusType.INITIAL,
        description: 'Тип статусу (початковий, інтерв\'ю, фінальний, інший)'
    }),
    (0, mongoose_1.Prop)({
        type: String,
        enum: StatusType,
        default: StatusType.OTHER
    }),
    __metadata("design:type", String)
], Status.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: false,
        description: 'Чи є статус статусом за замовчуванням'
    }),
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Status.prototype, "isDefault", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Чи є статус активним'
    }),
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Status.prototype, "isActive", void 0);
exports.Status = Status = __decorate([
    (0, mongoose_1.Schema)({
        timestamps: true,
        versionKey: false
    })
], Status);
exports.StatusSchema = mongoose_1.SchemaFactory.createForClass(Status);
//# sourceMappingURL=status.schema.js.map