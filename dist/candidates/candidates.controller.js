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
exports.CandidatesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const public_decorator_1 = require("../common/decorators/public.decorator");
const candidates_service_1 = require("./candidates.service");
const create_candidate_dto_1 = require("./dto/create-candidate.dto");
const update_candidate_dto_1 = require("./dto/update-candidate.dto");
let CandidatesController = class CandidatesController {
    constructor(candidatesService) {
        this.candidatesService = candidatesService;
    }
    async create(createCandidateDto) {
        return this.candidatesService.create(createCandidateDto);
    }
    async findAll(query) {
        return this.candidatesService.findAll(query);
    }
    async checkDuplicate(query) {
        console.log('RAW QUERY:', query);
        const { firstName, lastName } = query;
        if (!firstName || !lastName) {
            throw new common_1.BadRequestException('firstName and lastName are required');
        }
        const candidate = await this.candidatesService.findDuplicateByName(firstName, lastName);
        return { exists: !!candidate, candidate };
    }
    async findOne(id) {
        return this.candidatesService.findOne(id);
    }
    async update(id, updateCandidateDto) {
        return this.candidatesService.update(id, updateCandidateDto);
    }
    async remove(id) {
        return this.candidatesService.remove(id);
    }
    async updateStatus(id, status) {
        return this.candidatesService.updateStatus(id, status);
    }
    async updateCallbackStatus(id, callbackStatus) {
        return this.candidatesService.update(id, { callbackStatus });
    }
    async updateSource(id, source) {
        return this.candidatesService.update(id, { source });
    }
};
exports.CandidatesController = CandidatesController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Створити кандидата',
        description: 'Додає нового кандидата до системи. Обов\'язкові поля: firstName, lastName, createdBy, status.'
    }),
    (0, swagger_1.ApiBody)({
        type: create_candidate_dto_1.CreateCandidateDto,
        description: 'Дані для створення кандидата',
        examples: {
            example1: {
                value: {
                    firstName: 'Іван',
                    lastName: 'Петренко',
                    middleName: 'Олександрович',
                    email: 'ivan@example.com',
                    phone: '+380501234567',
                    age: 25,
                    position: 'Frontend Developer',
                    salary: 2000,
                    city: '662f1f77bcf86cd799439011',
                    source: '662f1f77bcf86cd799439012',
                    description: 'Досвідчений розробник з 3 роками досвіду',
                    createdBy: '507f1f77bcf86cd799439011',
                    status: '662f1f77bcf86cd799439013',
                    employmentType: 'Повна зайнятість',
                    gender: 'Чоловік',
                    isActive: true
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Кандидата створено.',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439011',
                firstName: 'Іван',
                lastName: 'Петренко',
                createdAt: '2024-03-20T10:00:00.000Z',
                updatedAt: '2024-03-20T10:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_candidate_dto_1.CreateCandidateDto]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: 'Пошук і фільтрація кандидатів',
        description: 'Гнучкий пошук і фільтрація кандидатів за різними параметрами.'
    }),
    (0, swagger_1.ApiQuery)({ name: 'q', required: false, description: 'Пошук по імені, email, телефону' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'ID статусу' }),
    (0, swagger_1.ApiQuery)({ name: 'city', required: false, description: 'ID міста' }),
    (0, swagger_1.ApiQuery)({ name: 'source', required: false, description: 'ID джерела' }),
    (0, swagger_1.ApiQuery)({ name: 'assignedRecruiter', required: false, description: 'ID рекрутера' }),
    (0, swagger_1.ApiQuery)({ name: 'createdBy', required: false, description: 'ID автора' }),
    (0, swagger_1.ApiQuery)({ name: 'isActive', required: false, description: 'Активний (true/false)' }),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', required: false, description: 'Дата створення від (ISO)' }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', required: false, description: 'Дата створення до (ISO)' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, description: 'Номер сторінки' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Кількість на сторінку' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Список кандидатів з пагінацією',
        schema: {
            example: {
                data: [
                    {
                        _id: '507f1f77bcf86cd799439011',
                        firstName: 'Іван',
                        lastName: 'Петренко',
                    }
                ],
                total: 100,
                page: 1,
                totalPages: 5
            }
        }
    }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "findAll", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('check-duplicate'),
    (0, swagger_1.ApiOperation)({ summary: 'Перевірка дублікату кандидата', description: 'Перевіряє, чи існує кандидат з таким імʼям та прізвищем.' }),
    (0, swagger_1.ApiQuery)({ name: 'firstName', required: true, description: 'Імʼя кандидата' }),
    (0, swagger_1.ApiQuery)({ name: 'lastName', required: true, description: 'Прізвище кандидата' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Дублікат знайдено або не знайдено', schema: { example: { exists: true, candidate: { _id: '...', firstName: '...', lastName: '...' } } } }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "checkDuplicate", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Отримати кандидата за ID',
        description: 'Повертає детальну інформацію про кандидата.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Детальна інформація про кандидата',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439011',
                firstName: 'Іван',
                lastName: 'Петренко',
            }
        }
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Оновити кандидата',
        description: 'Оновлює дані кандидата за ID. Всі поля є опціональними.'
    }),
    (0, swagger_1.ApiBody)({
        type: update_candidate_dto_1.UpdateCandidateDto,
        description: 'Дані для оновлення кандидата',
        examples: {
            example1: {
                value: {
                    status: 'На співбесіді',
                    callbackStatus: 'Заплановано',
                    callbackDescription: 'Зателефонувати о 15:00',
                    interviewDate: '2024-03-25T15:00:00.000Z'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Кандидата оновлено',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439011',
                firstName: 'Іван',
                lastName: 'Петренко',
                status: 'На співбесіді',
                updatedAt: '2024-03-20T11:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_candidate_dto_1.UpdateCandidateDto]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({
        summary: 'Видалити кандидата',
        description: 'Видаляє кандидата з системи за ID.'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Кандидата видалено',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439011',
                firstName: 'Іван',
                lastName: 'Петренко',
                deletedAt: '2024-03-20T12:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({
        summary: 'Оновити статус кандидата',
        description: 'Оновлює статус кандидата за ID.'
    }),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                status: {
                    type: 'string',
                    description: 'ID нового статусу',
                    example: '662f1f77bcf86cd799439013'
                }
            }
        }
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Статус кандидата оновлено',
        schema: {
            example: {
                _id: '507f1f77bcf86cd799439011',
                firstName: 'Іван',
                lastName: 'Петренко',
                status: '662f1f77bcf86cd799439013',
                updatedAt: '2024-03-20T11:00:00.000Z'
            }
        }
    }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Patch)(':id/callback-status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('callbackStatus')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "updateCallbackStatus", null);
__decorate([
    (0, common_1.Patch)(':id/source'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('source')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], CandidatesController.prototype, "updateSource", null);
exports.CandidatesController = CandidatesController = __decorate([
    (0, swagger_1.ApiTags)('Кандидати'),
    (0, common_1.Controller)('candidates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [candidates_service_1.CandidatesService])
], CandidatesController);
//# sourceMappingURL=candidates.controller.js.map