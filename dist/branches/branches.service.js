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
exports.BranchesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const branch_schema_1 = require("./entities/branch.schema");
let BranchesService = class BranchesService {
    constructor(branchModel) {
        this.branchModel = branchModel;
    }
    async create(createBranchDto) {
        const branch = new this.branchModel(createBranchDto);
        return branch.save();
    }
    async findAll() {
        return this.branchModel.find({ isActive: true }).populate('city', 'name').lean();
    }
    async findOne(id) {
        const branch = await this.branchModel.findById(id).populate('city', 'name').lean();
        if (!branch)
            throw new common_1.NotFoundException(`Branch with ID ${id} not found`);
        return branch;
    }
    async update(id, updateBranchDto) {
        return this.branchModel.findByIdAndUpdate(id, updateBranchDto, { new: true }).populate('city', 'name').lean();
    }
    async remove(id) {
        return this.branchModel.findByIdAndDelete(id).populate('city', 'name').lean();
    }
    async findByIds(ids) {
        return this.branchModel.find({ _id: { $in: ids } }).populate('city', 'name').lean();
    }
    async findByName(name) {
        return this.branchModel.find({ name: { $regex: name, $options: 'i' }, isActive: true }).populate('city', 'name').lean();
    }
};
exports.BranchesService = BranchesService;
exports.BranchesService = BranchesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BranchesService);
//# sourceMappingURL=branches.service.js.map