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
exports.TestController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const role_enum_1 = require("../common/enums/role.enum");
const roles_guard_1 = require("../common/guards/roles.guard");
const test_service_1 = require("./test.service");
let TestController = class TestController {
    constructor(testService) {
        this.testService = testService;
    }
    async seedTestData() {
        return this.testService.seedTestData();
    }
};
exports.TestController = TestController;
__decorate([
    (0, common_1.Post)('seed'),
    (0, roles_decorator_1.Roles)(role_enum_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({
        summary: 'Згенерувати тестові дані',
        description: 'Створює набір тестових даних для розробки та тестування. Доступно тільки для адміністраторів.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Тестові дані успішно створено',
        schema: {
            example: {
                message: 'Test data seeded successfully',
                counts: {
                    cities: 5,
                    branch: 1,
                    statuses: 5,
                    sources: 5,
                    users: 2,
                    candidates: 20
                }
            }
        }
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TestController.prototype, "seedTestData", null);
exports.TestController = TestController = __decorate([
    (0, swagger_1.ApiTags)('Тестові дані'),
    (0, common_1.Controller)('test'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [test_service_1.TestService])
], TestController);
//# sourceMappingURL=test.controller.js.map