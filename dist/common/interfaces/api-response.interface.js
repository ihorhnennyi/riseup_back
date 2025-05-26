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
exports.ApiResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
class ApiResponse {
}
exports.ApiResponse = ApiResponse;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: true,
        description: 'Статус виконання операції'
    }),
    __metadata("design:type", Boolean)
], ApiResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'Операцію успішно виконано',
        description: 'Повідомлення про результат операції'
    }),
    __metadata("design:type", String)
], ApiResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: null,
        nullable: true,
        description: 'Дані, повернуті в результаті операції'
    }),
    __metadata("design:type", Object)
], ApiResponse.prototype, "data", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: null,
        nullable: true,
        description: 'Повідомлення про помилку (якщо виникла)'
    }),
    __metadata("design:type", String)
], ApiResponse.prototype, "error", void 0);
//# sourceMappingURL=api-response.interface.js.map