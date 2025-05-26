"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const branch_schema_1 = require("../branches/schemas/branch.schema");
const candidate_schema_1 = require("../candidates/entities/candidate.schema");
const city_schema_1 = require("../cities/schemas/city.schema");
const source_schema_1 = require("../sources/schemas/source.schema");
const status_schema_1 = require("../statuses/schemas/status.schema");
const user_schema_1 = require("../users/schemas/user.schema");
const test_controller_1 = require("./test.controller");
const test_service_1 = require("./test.service");
let TestModule = class TestModule {
};
exports.TestModule = TestModule;
exports.TestModule = TestModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: candidate_schema_1.Candidate.name, schema: candidate_schema_1.CandidateSchema },
                { name: city_schema_1.City.name, schema: city_schema_1.CitySchema },
                { name: status_schema_1.Status.name, schema: status_schema_1.StatusSchema },
                { name: source_schema_1.Source.name, schema: source_schema_1.SourceSchema },
                { name: branch_schema_1.Branch.name, schema: branch_schema_1.BranchSchema },
            ]),
        ],
        controllers: [test_controller_1.TestController],
        providers: [test_service_1.TestService],
    })
], TestModule);
//# sourceMappingURL=test.module.js.map