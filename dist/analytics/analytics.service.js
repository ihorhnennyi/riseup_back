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
var AnalyticsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const candidates_service_1 = require("../candidates/candidates.service");
const role_enum_1 = require("../common/enums/role.enum");
const statuses_service_1 = require("../statuses/statuses.service");
const users_service_1 = require("../users/users.service");
const recruitment_metrics_entity_1 = require("./entities/recruitment-metrics.entity");
let AnalyticsService = AnalyticsService_1 = class AnalyticsService {
    constructor(recruitmentMetricsModel, candidatesService, usersService, statusesService) {
        this.recruitmentMetricsModel = recruitmentMetricsModel;
        this.candidatesService = candidatesService;
        this.usersService = usersService;
        this.statusesService = statusesService;
        this.logger = new common_1.Logger(AnalyticsService_1.name);
    }
    getStatusName(status) {
        return status === null || status === void 0 ? void 0 : status.name;
    }
    async calculateDailyMetrics(date = new Date()) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const candidates = await this.candidatesService.findAll({
            fromDate: startOfDay,
            toDate: endOfDay,
        });
        const metrics = new this.recruitmentMetricsModel({
            period: 'daily',
            date: startOfDay,
            totalCandidates: candidates.total,
            newCandidates: candidates.data.filter(c => new Date(c.createdAt) >= startOfDay).length,
        });
        return metrics.save();
    }
    async getRecruiterMetrics(recruiterId, period, startDate, endDate) {
        const candidates = await this.candidatesService.findAll({
            fromDate: startDate,
            toDate: endDate,
        });
        const recruiterCandidates = candidates.data.filter(c => c.assignedRecruiter && c.assignedRecruiter.toString() === recruiterId);
        const statusMetrics = {
            total: recruiterCandidates.length,
            byStatus: this.calculateStatusDistribution(recruiterCandidates),
            calls: {
                total: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'called').length,
                successful: recruiterCandidates.filter(c => { var _a; return this.getStatusName(c.callbackStatus) === 'called' && ((_a = c.callbackDescription) === null || _a === void 0 ? void 0 : _a.includes('successful')); }).length,
                failed: recruiterCandidates.filter(c => { var _a; return this.getStatusName(c.callbackStatus) === 'called' && ((_a = c.callbackDescription) === null || _a === void 0 ? void 0 : _a.includes('failed')); }).length,
            },
            interviews: {
                scheduled: recruiterCandidates.filter(c => c.interviewDate).length,
                completed: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'interview_completed').length,
                noShow: recruiterCandidates.filter(c => { var _a; return this.getStatusName(c.callbackStatus) === 'interview_completed' && ((_a = c.callbackDescription) === null || _a === void 0 ? void 0 : _a.includes('no_show')); }).length,
            },
            offers: {
                made: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'offer_made').length,
                accepted: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'offer_accepted').length,
                rejected: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'offer_rejected').length,
            },
            hired: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'hired').length,
            rejected: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'rejected').length,
            conversionRate: 0,
        };
        statusMetrics.conversionRate = (statusMetrics.hired / statusMetrics.total) * 100;
        return {
            period,
            startDate,
            endDate,
            metrics: statusMetrics,
        };
    }
    async getSourceAnalytics(startDate, endDate) {
        const candidates = await this.candidatesService.findAll({
            fromDate: startDate,
            toDate: endDate,
        });
        const sourceMetrics = {};
        candidates.data.forEach(candidate => {
            var _a;
            const sourceId = ((_a = candidate.source) === null || _a === void 0 ? void 0 : _a.toString()) || 'unknown';
            if (!sourceMetrics[sourceId]) {
                sourceMetrics[sourceId] = {
                    total: 0,
                    hired: 0,
                    conversionRate: 0,
                };
            }
            sourceMetrics[sourceId].total++;
            if (this.getStatusName(candidate.callbackStatus) === 'hired') {
                sourceMetrics[sourceId].hired++;
            }
        });
        Object.keys(sourceMetrics).forEach(source => {
            const metrics = sourceMetrics[source];
            metrics.conversionRate = (metrics.hired / metrics.total) * 100;
        });
        return sourceMetrics;
    }
    async getTimeToHireMetrics(startDate, endDate) {
        const candidates = await this.candidatesService.findAll({
            fromDate: startDate,
            toDate: endDate,
        });
        const hiredCandidates = candidates.data.filter(c => this.getStatusName(c.callbackStatus) === 'hired');
        const timeToHireMetrics = {
            average: 0,
            min: Infinity,
            max: 0,
            byPosition: {},
        };
        if (hiredCandidates.length > 0) {
            let totalTime = 0;
            hiredCandidates.forEach(candidate => {
                const candidateWithTimestamps = candidate;
                const timeToHire = (new Date(candidateWithTimestamps.updatedAt).getTime() - new Date(candidateWithTimestamps.createdAt).getTime()) / (1000 * 60 * 60);
                totalTime += timeToHire;
                timeToHireMetrics.min = Math.min(timeToHireMetrics.min, timeToHire);
                timeToHireMetrics.max = Math.max(timeToHireMetrics.max, timeToHire);
                const position = candidate.position || 'unknown';
                if (!timeToHireMetrics.byPosition[position]) {
                    timeToHireMetrics.byPosition[position] = {
                        total: 0,
                        count: 0,
                        average: 0,
                    };
                }
                timeToHireMetrics.byPosition[position].total += timeToHire;
                timeToHireMetrics.byPosition[position].count++;
            });
            timeToHireMetrics.average = totalTime / hiredCandidates.length;
            Object.keys(timeToHireMetrics.byPosition).forEach(position => {
                const metrics = timeToHireMetrics.byPosition[position];
                metrics.average = metrics.total / metrics.count;
            });
        }
        return timeToHireMetrics;
    }
    async getRecruitmentDashboard(startDate, endDate) {
        const [sourceAnalytics, timeToHireMetrics, candidates,] = await Promise.all([
            this.getSourceAnalytics(startDate, endDate),
            this.getTimeToHireMetrics(startDate, endDate),
            this.candidatesService.findAll({
                fromDate: startDate,
                toDate: endDate,
            }),
        ]);
        return {
            overview: {
                totalCandidates: candidates.total,
                activeCandidates: candidates.data.filter(c => {
                    const status = this.getStatusName(c.callbackStatus);
                    return status !== 'hired' && status !== 'rejected';
                }).length,
                hiredCandidates: candidates.data.filter(c => this.getStatusName(c.callbackStatus) === 'hired').length,
                rejectionRate: (candidates.data.filter(c => this.getStatusName(c.callbackStatus) === 'rejected').length / candidates.total) * 100,
            },
            sourceAnalytics,
            timeToHireMetrics,
            statusDistribution: this.calculateStatusDistribution(candidates.data),
            cityDistribution: this.calculateCityDistribution(candidates.data),
        };
    }
    calculateStatusDistribution(candidates) {
        const distribution = {};
        candidates.forEach(candidate => {
            const status = this.getStatusName(candidate.callbackStatus) || String(candidate.callbackStatus);
            if (!distribution[status]) {
                distribution[status] = 0;
            }
            distribution[status]++;
        });
        return distribution;
    }
    calculateCityDistribution(candidates) {
        const distribution = {};
        candidates.forEach(candidate => {
            var _a;
            const cityId = ((_a = candidate.city) === null || _a === void 0 ? void 0 : _a.toString()) || 'unknown';
            if (!distribution[cityId]) {
                distribution[cityId] = 0;
            }
            distribution[cityId]++;
        });
        return distribution;
    }
    async getUserStatusStats(userId, fromDate, toDate) {
        let users = await this.usersService.findAll({}, role_enum_1.UserRole.SUPER_ADMIN);
        if (userId) {
            users.data = users.data.filter((u) => { var _a; return ((_a = u._id) === null || _a === void 0 ? void 0 : _a.toString()) === userId; });
        }
        const statuses = await this.statusesService.findAll();
        const candidateQuery = {};
        if (fromDate || toDate) {
            candidateQuery.updatedAt = {};
            if (fromDate)
                candidateQuery.updatedAt.$gte = new Date(fromDate);
            if (toDate)
                candidateQuery.updatedAt.$lte = new Date(toDate);
        }
        const candidatesRes = await this.candidatesService.findAll(candidateQuery);
        const candidates = candidatesRes.data;
        const result = users.data.map((user) => {
            var _a;
            const userIdStr = (_a = user._id) === null || _a === void 0 ? void 0 : _a.toString();
            const userCandidates = candidates.filter((c) => {
                var _a, _b;
                const createdById = typeof c.createdBy === 'object' && c.createdBy !== null
                    ? (_a = c.createdBy._id) === null || _a === void 0 ? void 0 : _a.toString()
                    : (_b = c.createdBy) === null || _b === void 0 ? void 0 : _b.toString();
                return createdById === userIdStr;
            });
            const statusesCount = {};
            statuses.forEach((st) => {
                var _a;
                const statusId = (_a = st._id) === null || _a === void 0 ? void 0 : _a.toString();
                statusesCount[st._id] = userCandidates.filter((c) => {
                    var _a, _b;
                    const candidateStatusId = typeof c.status === 'object' && c.status !== null
                        ? (_a = c.status._id) === null || _a === void 0 ? void 0 : _a.toString()
                        : (_b = c.status) === null || _b === void 0 ? void 0 : _b.toString();
                    return candidateStatusId === statusId;
                }).length;
            });
            return {
                userId: user._id,
                userName: [user.firstName, user.lastName].filter(Boolean).join(' '),
                statuses: statusesCount,
            };
        });
        return result;
    }
    async getStatusStats(fromDate, toDate) {
        const candidates = await this.candidatesService.findAll({
            updatedAt: {
                $gte: new Date(fromDate),
                $lte: new Date(toDate),
            }
        });
        const statuses = await this.statusesService.findAll();
        const stats = statuses.map(st => ({
            statusId: st._id,
            statusName: st.name,
            count: candidates.data.filter(c => {
                const statusId = typeof c.status === 'object' ? String(c.status._id) : String(c.status);
                return statusId === String(st._id);
            }).length
        }));
        return stats;
    }
};
exports.AnalyticsService = AnalyticsService;
exports.AnalyticsService = AnalyticsService = AnalyticsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(recruitment_metrics_entity_1.RecruitmentMetrics.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        candidates_service_1.CandidatesService,
        users_service_1.UsersService,
        statuses_service_1.StatusesService])
], AnalyticsService);
//# sourceMappingURL=analytics.service.js.map