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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntegrationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_integration_dto_1 = require("./dto/create-integration.dto");
const create_user_integration_dto_1 = require("./dto/create-user-integration.dto");
const integrations_service_1 = require("./integrations.service");
let IntegrationsController = class IntegrationsController {
    constructor(integrationsService) {
        this.integrationsService = integrationsService;
    }
    createIntegration(createIntegrationDto) {
        return this.integrationsService.createIntegration(createIntegrationDto);
    }
    findAllIntegrations() {
        return this.integrationsService.findAllIntegrations();
    }
    findOneIntegration(id) {
        return this.integrationsService.findOneIntegration(id);
    }
    createUserIntegration(req, createUserIntegrationDto) {
        return this.integrationsService.createUserIntegration(req.user.id, createUserIntegrationDto);
    }
    findUserIntegrations(req) {
        return this.integrationsService.findUserIntegrations(req.user.id);
    }
    findOneUserIntegration(req, id) {
        return this.integrationsService.findOneUserIntegration(req.user.id, id);
    }
    removeIntegration(id) {
        return this.integrationsService.removeIntegration(id);
    }
};
exports.IntegrationsController = IntegrationsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Створити інтеграцію',
        description: 'Створює нову інтеграцію (шаблон сервісу) для всієї системи. Доступно лише адміністратору.'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                name: 'Work.ua',
                url: 'https://work.ua',
                description: 'Імпорт кандидатів з Work.ua',
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_integration_dto_1.CreateIntegrationDto]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "createIntegration", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Отримати всі інтеграції',
        description: 'Повертає список усіх доступних інтеграцій (шаблонів сервісів) у системі.'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "findAllIntegrations", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Отримати інтеграцію за ID',
        description: 'Повертає детальну інформацію про інтеграцію (шаблон) за її ID.'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "findOneIntegration", null);
__decorate([
    (0, common_1.Post)('user'),
    (0, swagger_1.ApiOperation)({
        summary: 'Підключити інтеграцію користувачу',
        description: 'Додає інтеграцію конкретному користувачу з його логіном і паролем.'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                integrationId: '662a1dd8a5a4ed5c9dac7111',
                login: 'ivan@work.ua',
                password: 'qwerty123',
            },
        },
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_user_integration_dto_1.CreateUserIntegrationDto]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "createUserIntegration", null);
__decorate([
    (0, common_1.Get)('user/all'),
    (0, swagger_1.ApiOperation)({
        summary: 'Отримати всі інтеграції користувача',
        description: 'Повертає список усіх інтеграцій, підключених саме цим користувачем.'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "findUserIntegrations", null);
__decorate([
    (0, common_1.Get)('user/:id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Отримати інтеграцію користувача за ID',
        description: 'Повертає детальну інформацію про одну інтеграцію користувача за її ID.'
    }),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "findOneUserIntegration", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], IntegrationsController.prototype, "removeIntegration", null);
exports.IntegrationsController = IntegrationsController = __decorate([
    (0, swagger_1.ApiTags)('Інтеграції'),
    (0, common_1.Controller)('integrations'),
    __metadata("design:paramtypes", [integrations_service_1.IntegrationsService])
], IntegrationsController);
//# sourceMappingURL=integrations.controller.js.map