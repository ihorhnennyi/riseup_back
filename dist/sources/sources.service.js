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
exports.SourcesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const source_schema_1 = require("./entities/source.schema");
let SourcesService = class SourcesService {
    constructor(sourceModel) {
        this.sourceModel = sourceModel;
    }
    async create(createSourceDto) {
        const source = new this.sourceModel(createSourceDto);
        return source.save();
    }
    async findAll() {
        return this.sourceModel.find().lean();
    }
    async findOne(id) {
        const source = await this.sourceModel.findById(id).lean();
        if (!source)
            throw new common_1.NotFoundException('Source not found');
        return source;
    }
    async update(id, updateSourceDto) {
        return this.sourceModel.findByIdAndUpdate(id, updateSourceDto, { new: true }).lean();
    }
    async remove(id) {
        return this.sourceModel.findByIdAndDelete(id).lean();
    }
};
exports.SourcesService = SourcesService;
exports.SourcesService = SourcesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(source_schema_1.Source.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SourcesService);
//# sourceMappingURL=sources.service.js.map