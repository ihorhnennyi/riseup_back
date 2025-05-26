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
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const analytics_service_1 = require("./analytics.service");
let AnalyticsController = class AnalyticsController {
    constructor(analyticsService) {
        this.analyticsService = analyticsService;
    }
    async getDashboard(startDate, endDate) {
        return this.analyticsService.getRecruitmentDashboard(startDate, endDate);
    }
    async getSourceAnalytics(startDate, endDate) {
        return this.analyticsService.getSourceAnalytics(startDate, endDate);
    }
    async getTimeToHireMetrics(startDate, endDate) {
        return this.analyticsService.getTimeToHireMetrics(startDate, endDate);
    }
    async getRecruiterMetrics(recruiterId, period, startDate, endDate) {
        return this.analyticsService.getRecruiterMetrics(recruiterId, period, startDate, endDate);
    }
    async getUserStatusStats(userId, fromDate, toDate) {
        return this.analyticsService.getUserStatusStats(userId, fromDate, toDate);
    }
    async getStatusStats(fromDate, toDate) {
        return this.analyticsService.getStatusStats(fromDate, toDate);
    }
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.Get)('dashboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recruitment dashboard data' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns dashboard data' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('sources'),
    (0, swagger_1.ApiOperation)({ summary: 'Get source analytics' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns source analytics' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getSourceAnalytics", null);
__decorate([
    (0, common_1.Get)('time-to-hire'),
    (0, swagger_1.ApiOperation)({ summary: 'Get time to hire metrics' }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns time to hire metrics' }),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Date,
        Date]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTimeToHireMetrics", null);
__decorate([
    (0, common_1.Get)('recruiter/:recruiterId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get recruiter metrics' }),
    (0, swagger_1.ApiQuery)({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'] }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: true, type: Date }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: true, type: Date }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns recruiter metrics' }),
    __param(0, (0, common_1.Query)('recruiterId')),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Date,
        Date]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getRecruiterMetrics", null);
__decorate([
    (0, common_1.Get)('user-status-stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Статистика по статусам кандидатов для всех пользователей' }),
    (0, swagger_1.ApiQuery)({ name: 'userId', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', required: false, type: String }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Статистика по статусам кандидатов для всех пользователей' }),
    __param(0, (0, common_1.Query)('userId')),
    __param(1, (0, common_1.Query)('fromDate')),
    __param(2, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getUserStatusStats", null);
__decorate([
    (0, common_1.Get)('status-stats'),
    (0, swagger_1.ApiQuery)({ name: 'fromDate', required: true, type: String }),
    (0, swagger_1.ApiQuery)({ name: 'toDate', required: true, type: String }),
    __param(0, (0, common_1.Query)('fromDate')),
    __param(1, (0, common_1.Query)('toDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getStatusStats", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, swagger_1.ApiTags)('analytics'),
    (0, common_1.Controller)('analytics'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [analytics_service_1.AnalyticsService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map