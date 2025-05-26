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
exports.IntegrationsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const integration_schema_1 = require("./entities/integration.schema");
const user_integration_schema_1 = require("./entities/user-integration.schema");
let IntegrationsService = class IntegrationsService {
    constructor(integrationModel, userIntegrationModel) {
        this.integrationModel = integrationModel;
        this.userIntegrationModel = userIntegrationModel;
    }
    async createIntegration(createIntegrationDto) {
        const integration = new this.integrationModel(createIntegrationDto);
        return integration.save();
    }
    async findAllIntegrations() {
        return this.integrationModel.find().lean();
    }
    async findOneIntegration(id) {
        const integration = await this.integrationModel.findById(id).lean();
        if (!integration)
            throw new common_1.NotFoundException('Integration not found');
        return integration;
    }
    async createUserIntegration(userId, createUserIntegrationDto) {
        const userIntegration = new this.userIntegrationModel(Object.assign(Object.assign({}, createUserIntegrationDto), { userId: new mongoose_2.Types.ObjectId(userId) }));
        return userIntegration.save();
    }
    async findUserIntegrations(userId) {
        return this.userIntegrationModel.find({ userId: new mongoose_2.Types.ObjectId(userId) }).populate('integrationId').lean();
    }
    async findOneUserIntegration(userId, id) {
        const userIntegration = await this.userIntegrationModel.findOne({
            _id: id,
            userId: new mongoose_2.Types.ObjectId(userId),
        }).populate('integrationId').lean();
        if (!userIntegration)
            throw new common_1.NotFoundException('UserIntegration not found');
        return userIntegration;
    }
    async removeIntegration(id) {
        return this.integrationModel.findByIdAndDelete(id).lean();
    }
};
exports.IntegrationsService = IntegrationsService;
exports.IntegrationsService = IntegrationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(integration_schema_1.Integration.name)),
    __param(1, (0, mongoose_1.InjectModel)(user_integration_schema_1.UserIntegration.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], IntegrationsService);
//# sourceMappingURL=integrations.service.js.map