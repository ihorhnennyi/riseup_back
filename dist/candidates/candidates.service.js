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
var CandidatesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const telegram_service_1 = require("../telegram/telegram.service");
const candidate_schema_1 = require("./entities/candidate.schema");
let CandidatesService = CandidatesService_1 = class CandidatesService {
    constructor(candidateModel, telegramService) {
        this.candidateModel = candidateModel;
        this.telegramService = telegramService;
        this.logger = new common_1.Logger(CandidatesService_1.name);
    }
    toObjectId(id) {
        if (!id)
            return undefined;
        if (id instanceof mongoose_2.Types.ObjectId)
            return id;
        try {
            return new mongoose_2.Types.ObjectId(id);
        }
        catch (_a) {
            return undefined;
        }
    }
    normalizeRefs(dto) {
        return Object.assign(Object.assign({}, dto), { status: this.toObjectId(dto.status), city: this.toObjectId(dto.city), source: this.toObjectId(dto.source), createdBy: this.toObjectId(dto.createdBy), callbackStatus: this.toObjectId(dto.callbackStatus), assignedRecruiter: this.toObjectId(dto.assignedRecruiter), integrationId: this.toObjectId(dto.integrationId) });
    }
    async create(createCandidateDto) {
        var _a;
        const candidateData = this.normalizeRefs(Object.assign(Object.assign({}, createCandidateDto), { createdBy: createCandidateDto.createdBy || new mongoose_2.Types.ObjectId('507f1f77bcf86cd799439011'), status: createCandidateDto.status || new mongoose_2.Types.ObjectId('662f1f77bcf86cd799439013'), isActive: (_a = createCandidateDto.isActive) !== null && _a !== void 0 ? _a : true }));
        const candidate = new this.candidateModel(candidateData);
        const savedCandidate = await candidate.save();
        await this.telegramService.sendCandidateNotification(savedCandidate, 'created');
        return savedCandidate;
    }
    validateObjectId(id) {
        try {
            return new mongoose_2.Types.ObjectId(id);
        }
        catch (error) {
            throw new common_1.BadRequestException('Invalid ID format');
        }
    }
    async paginateQuery(filter, page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.candidateModel
                .find(filter)
                .skip(skip)
                .limit(limit)
                .populate('createdBy', 'firstName lastName email role')
                .populate('city', 'name')
                .populate('source', 'name')
                .populate('status', 'name color description')
                .populate('callbackStatus', 'name color description')
                .populate('assignedRecruiter', 'firstName lastName email role')
                .populate('integrationId', 'name')
                .lean(),
            this.candidateModel.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(total / limit);
        return { data, total, page, totalPages };
    }
    async findAll(query = {}) {
        const filter = {};
        if (query.status)
            filter.status = this.validateObjectId(query.status);
        if (query.city)
            filter.city = this.validateObjectId(query.city);
        if (query.source)
            filter.source = this.validateObjectId(query.source);
        if (query.assignedRecruiter)
            filter.assignedRecruiter = this.validateObjectId(query.assignedRecruiter);
        if (query.createdBy)
            filter.createdBy = this.validateObjectId(query.createdBy);
        if (query.isActive !== undefined)
            filter.isActive = query.isActive === 'true' || query.isActive === true;
        if (query.fromDate || query.toDate) {
            filter.createdAt = {};
            if (query.fromDate)
                filter.createdAt.$gte = new Date(query.fromDate);
            if (query.toDate)
                filter.createdAt.$lte = new Date(query.toDate);
        }
        if (query.q) {
            const regex = new RegExp(query.q, 'i');
            filter.$or = [
                { firstName: regex },
                { lastName: regex },
                { middleName: regex },
                { email: regex },
                { phone: regex },
                { description: regex },
            ];
        }
        const page = parseInt(query.page, 10) || 1;
        const limit = parseInt(query.limit, 10) || 20;
        return this.paginateQuery(filter, page, limit);
    }
    async findOne(id) {
        const candidate = await this.candidateModel
            .findById(this.validateObjectId(id))
            .populate('createdBy', 'firstName lastName email role')
            .populate('city', 'name')
            .populate('source', 'name')
            .populate('status', 'name color description')
            .populate('callbackStatus', 'name color description')
            .populate('assignedRecruiter', 'firstName lastName email role')
            .populate('integrationId', 'name')
            .lean();
        if (!candidate)
            throw new common_1.NotFoundException('Candidate not found');
        return candidate;
    }
    async update(id, updateCandidateDto) {
        const candidate = await this.candidateModel.findByIdAndUpdate(this.validateObjectId(id), this.normalizeRefs(updateCandidateDto), { new: true })
            .populate('createdBy', 'firstName lastName email role')
            .populate('city', 'name')
            .populate('source', 'name')
            .populate('status', 'name color description')
            .populate('callbackStatus', 'name color description')
            .populate('assignedRecruiter', 'firstName lastName email role')
            .populate('integrationId', 'name')
            .lean();
        if (!candidate)
            throw new common_1.NotFoundException('Candidate not found');
        await this.telegramService.sendCandidateNotification(candidate, 'updated');
        return candidate;
    }
    async remove(id) {
        const candidate = await this.candidateModel.findByIdAndDelete(this.validateObjectId(id))
            .populate('createdBy', 'firstName lastName email role')
            .populate('city', 'name')
            .populate('source', 'name')
            .populate('status', 'name color description')
            .populate('callbackStatus', 'name color description')
            .populate('assignedRecruiter', 'firstName lastName email role')
            .populate('integrationId', 'name')
            .lean();
        if (!candidate)
            throw new common_1.NotFoundException('Candidate not found');
        return candidate;
    }
    async updateStatus(candidateId, newStatus) {
        const candidate = await this.candidateModel.findById(this.validateObjectId(candidateId));
        if (!candidate) {
            throw new common_1.NotFoundException('Candidate not found');
        }
        candidate.status = this.validateObjectId(newStatus);
        return candidate.save();
    }
    async findDuplicateByName(firstName, lastName) {
        try {
            console.log('findDuplicateByName:', { firstName, lastName });
            return await this.candidateModel.findOne({
                firstName: firstName,
                lastName: lastName,
            }).lean();
        }
        catch (e) {
            console.error('Error in findDuplicateByName:', e);
            throw new common_1.BadRequestException('Ошибка поиска дубликата: ' + ((e === null || e === void 0 ? void 0 : e.message) || e));
        }
    }
};
exports.CandidatesService = CandidatesService;
exports.CandidatesService = CandidatesService = CandidatesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(candidate_schema_1.Candidate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        telegram_service_1.TelegramService])
], CandidatesService);
//# sourceMappingURL=candidates.service.js.map