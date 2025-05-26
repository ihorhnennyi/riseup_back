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
exports.AuthResponse = void 0;
const swagger_1 = require("@nestjs/swagger");
const role_enum_1 = require("../../common/enums/role.enum");
class AuthUserInfo {
}
__decorate([
    (0, swagger_1.ApiProperty)({ example: '507f1f77bcf86cd799439011' }),
    __metadata("design:type", String)
], AuthUserInfo.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin' }),
    __metadata("design:type", String)
], AuthUserInfo.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: role_enum_1.UserRole, example: role_enum_1.UserRole.SUPER_ADMIN }),
    __metadata("design:type", String)
], AuthUserInfo.prototype, "role", void 0);
class AuthResponse {
}
exports.AuthResponse = AuthResponse;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    __metadata("design:type", Boolean)
], AuthResponse.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Welcome back, Admin!' }),
    __metadata("design:type", String)
], AuthResponse.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: {
            user: {
                id: '507f1f77bcf86cd799439011',
                firstName: 'Admin',
                role: 'super_admin'
            },
            tokens: {
                accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
                refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
            }
        }
    }),
    __metadata("design:type", Object)
], AuthResponse.prototype, "data", void 0);
//# sourceMappingURL=auth-response.interface.js.map