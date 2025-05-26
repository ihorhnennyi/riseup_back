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
exports.SourcesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_source_dto_1 = require("./dto/create-source.dto");
const update_source_dto_1 = require("./dto/update-source.dto");
const sources_service_1 = require("./sources.service");
let SourcesController = class SourcesController {
    constructor(sourcesService) {
        this.sourcesService = sourcesService;
    }
    create(createSourceDto) {
        return this.sourcesService.create(createSourceDto);
    }
    findAll() {
        return this.sourcesService.findAll();
    }
    findOne(id) {
        return this.sourcesService.findOne(id);
    }
    update(id, updateSourceDto) {
        return this.sourcesService.update(id, updateSourceDto);
    }
    remove(id) {
        return this.sourcesService.remove(id);
    }
};
exports.SourcesController = SourcesController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Створити джерело', description: 'Додає нове джерело для кандидатів.' }),
    (0, swagger_1.ApiBody)({ type: create_source_dto_1.CreateSourceDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Джерело створено.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_source_dto_1.CreateSourceDto]),
    __metadata("design:returntype", void 0)
], SourcesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати всі джерела', description: 'Повертає список усіх джерел.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Список джерел.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], SourcesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Отримати джерело за ID', description: 'Повертає детальну інформацію про джерело.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Детальна інформація про джерело.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SourcesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Оновити джерело', description: 'Оновлює дані джерела за ID.' }),
    (0, swagger_1.ApiBody)({ type: update_source_dto_1.UpdateSourceDto }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Джерело оновлено.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_source_dto_1.UpdateSourceDto]),
    __metadata("design:returntype", void 0)
], SourcesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Видалити джерело', description: 'Видаляє джерело за ID.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Джерело видалено.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SourcesController.prototype, "remove", null);
exports.SourcesController = SourcesController = __decorate([
    (0, swagger_1.ApiTags)('Джерела'),
    (0, common_1.Controller)('sources'),
    __metadata("design:paramtypes", [sources_service_1.SourcesService])
], SourcesController);
//# sourceMappingURL=sources.controller.js.map