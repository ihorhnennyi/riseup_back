"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const status_schema_1 = require("./entities/status.schema");
const statuses_controller_1 = require("./statuses.controller");
const statuses_service_1 = require("./statuses.service");
let StatusesModule = class StatusesModule {
};
exports.StatusesModule = StatusesModule;
exports.StatusesModule = StatusesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: status_schema_1.Status.name, schema: status_schema_1.StatusSchema }])],
        controllers: [statuses_controller_1.StatusesController],
        providers: [statuses_service_1.StatusesService],
        exports: [statuses_service_1.StatusesService],
    })
], StatusesModule);
//# sourceMappingURL=statuses.module.js.map