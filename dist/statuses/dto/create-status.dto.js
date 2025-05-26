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
exports.CreateStatusDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateStatusDto {
}
exports.CreateStatusDto = CreateStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'На розгляді',
        description: 'Назва статусу кандидата'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateStatusDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '#FFD700',
        description: 'Колір статусу в HEX форматі (наприклад, #FFD700)'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
        message: 'Колір повинен бути у форматі HEX (наприклад, #FFD700)',
    }),
    __metadata("design:type", String)
], CreateStatusDto.prototype, "color", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Кандидат знаходиться на етапі розгляду резюме',
        description: 'Детальний опис статусу',
        required: false
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateStatusDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: false, required: false }),
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateStatusDto.prototype, "isDefault", void 0);
//# sourceMappingURL=create-status.dto.js.map