"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CitiesModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const cities_controller_1 = require("./cities.controller");
const cities_service_1 = require("./cities.service");
const city_schema_1 = require("./entities/city.schema");
let CitiesModule = class CitiesModule {
};
exports.CitiesModule = CitiesModule;
exports.CitiesModule = CitiesModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: city_schema_1.City.name, schema: city_schema_1.CitySchema }])],
        controllers: [cities_controller_1.CitiesController],
        providers: [cities_service_1.CitiesService],
        exports: [cities_service_1.CitiesService],
    })
], CitiesModule);
//# sourceMappingURL=cities.module.js.map