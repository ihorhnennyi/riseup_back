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
exports.CitiesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const city_schema_1 = require("./entities/city.schema");
let CitiesService = class CitiesService {
    constructor(cityModel) {
        this.cityModel = cityModel;
    }
    async create(createCityDto) {
        const city = new this.cityModel(createCityDto);
        return city.save();
    }
    async findAll() {
        return this.cityModel.find({ isActive: true }).lean();
    }
    async findOne(id) {
        const city = await this.cityModel.findById(id).lean();
        if (!city)
            throw new common_1.NotFoundException(`City with ID ${id} not found`);
        return city;
    }
    async update(id, updateCityDto) {
        return this.cityModel.findByIdAndUpdate(id, updateCityDto, { new: true }).lean();
    }
    async remove(id) {
        return this.cityModel.findByIdAndDelete(id).lean();
    }
    async findByIds(ids) {
        return this.cityModel.find({ _id: { $in: ids } }).lean();
    }
    async findByName(name) {
        return this.cityModel.find({ name: { $regex: name, $options: 'i' }, isActive: true }).lean();
    }
};
exports.CitiesService = CitiesService;
exports.CitiesService = CitiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(city_schema_1.City.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CitiesService);
//# sourceMappingURL=cities.service.js.map