"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const telegram_module_1 = require("../telegram/telegram.module");
const candidates_controller_1 = require("./candidates.controller");
const candidates_service_1 = require("./candidates.service");
const candidate_schema_1 = require("./entities/candidate.schema");
let CandidatesModule = class CandidatesModule {
};
exports.CandidatesModule = CandidatesModule;
exports.CandidatesModule = CandidatesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: candidate_schema_1.Candidate.name, schema: candidate_schema_1.CandidateSchema }]),
            telegram_module_1.TelegramModule,
        ],
        controllers: [candidates_controller_1.CandidatesController],
        providers: [candidates_service_1.CandidatesService],
        exports: [candidates_service_1.CandidatesService],
    })
], CandidatesModule);
//# sourceMappingURL=candidates.module.js.map