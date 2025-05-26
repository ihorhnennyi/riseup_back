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
exports.StatusesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const status_schema_1 = require("./entities/status.schema");
let StatusesService = class StatusesService {
    constructor(statusModel) {
        this.statusModel = statusModel;
    }
    async create(createStatusDto) {
        if (createStatusDto.isDefault) {
            await this.resetDefaultStatus();
        }
        const status = new this.statusModel(createStatusDto);
        return status.save();
    }
    async findAll() {
        return this.statusModel.find({ isActive: true }).sort({ order: 1 }).lean();
    }
    async findOne(id) {
        const status = await this.statusModel.findById(id).lean();
        if (!status)
            throw new common_1.NotFoundException(`Status with ID ${id} not found`);
        return status;
    }
    async update(id, updateStatusDto) {
        if (updateStatusDto.isDefault) {
            await this.resetDefaultStatus();
        }
        return this.statusModel.findByIdAndUpdate(id, updateStatusDto, { new: true }).lean();
    }
    async remove(id) {
        const status = await this.findOne(id);
        if (status.isDefault) {
            throw new common_1.ConflictException('Cannot delete the default status');
        }
        return this.statusModel.findByIdAndDelete(id).lean();
    }
    async findByIds(ids) {
        return this.statusModel.find({ _id: { $in: ids } }).lean();
    }
    async findByName(name) {
        return this.statusModel.find({ name: { $regex: name, $options: 'i' }, isActive: true }).sort({ order: 1 }).lean();
    }
    async updateOrder(ids) {
        const updates = ids.map((id, index) => this.statusModel.findByIdAndUpdate(id, { order: index }, { new: true }).lean());
        return Promise.all(updates);
    }
    async getDefaultStatus() {
        const defaultStatus = await this.statusModel.findOne({ isDefault: true, isActive: true }).lean();
        if (!defaultStatus)
            throw new common_1.NotFoundException('Default status not found');
        return defaultStatus;
    }
    async resetDefaultStatus() {
        await this.statusModel.updateMany({ isDefault: true }, { isDefault: false });
    }
    async getCallbackStatuses() {
        return this.statusModel.find({ type: 'callback' });
    }
};
exports.StatusesService = StatusesService;
exports.StatusesService = StatusesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(status_schema_1.Status.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], StatusesService);
//# sourceMappingURL=statuses.service.js.map