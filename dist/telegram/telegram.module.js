"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const city_schema_1 = require("../cities/entities/city.schema");
const status_schema_1 = require("../statuses/entities/status.schema");
const user_schema_1 = require("../users/entities/user.schema");
const telegram_controller_1 = require("./telegram.controller");
const telegram_service_1 = require("./telegram.service");
let TelegramModule = class TelegramModule {
};
exports.TelegramModule = TelegramModule;
exports.TelegramModule = TelegramModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            mongoose_1.MongooseModule.forFeature([
                { name: city_schema_1.City.name, schema: city_schema_1.CitySchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: status_schema_1.Status.name, schema: status_schema_1.StatusSchema },
            ]),
        ],
        controllers: [telegram_controller_1.TelegramController],
        providers: [telegram_service_1.TelegramService],
        exports: [telegram_service_1.TelegramService],
    })
], TelegramModule);
//# sourceMappingURL=telegram.module.js.map