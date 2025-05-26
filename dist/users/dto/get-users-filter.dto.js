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
exports.GetUsersFilterDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const role_enum_1 = require("../../common/enums/role.enum");
class GetUsersFilterDto {
    constructor() {
        this.page = 1;
        this.limit = 10;
    }
}
exports.GetUsersFilterDto = GetUsersFilterDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Фільтр за роллю користувача'
    }),
    (0, class_validator_1.IsEnum)(role_enum_1.UserRole),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetUsersFilterDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Пошук за ім\'ям або прізвищем'
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetUsersFilterDto.prototype, "search", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Фільтр за філією'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetUsersFilterDto.prototype, "branch", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Фільтр за містом'
    }),
    (0, class_validator_1.IsMongoId)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], GetUsersFilterDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Номер сторінки',
        default: 1,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetUsersFilterDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        required: false,
        description: 'Кількість записів на сторінці',
        default: 10,
        minimum: 1
    }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], GetUsersFilterDto.prototype, "limit", void 0);
//# sourceMappingURL=get-users-filter.dto.js.map