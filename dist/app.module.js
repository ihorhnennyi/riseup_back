"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const analytics_module_1 = require("./analytics/analytics.module");
const auth_module_1 = require("./auth/auth.module");
const jwt_auth_guard_1 = require("./auth/guards/jwt-auth.guard");
const branches_module_1 = require("./branches/branches.module");
const candidates_module_1 = require("./candidates/candidates.module");
const cities_module_1 = require("./cities/cities.module");
const roles_guard_1 = require("./common/guards/roles.guard");
const configuration_1 = require("./config/configuration");
const database_config_1 = require("./config/database.config");
const telegram_config_1 = require("./config/telegram.config");
const integrations_module_1 = require("./integrations/integrations.module");
const sources_module_1 = require("./sources/sources.module");
const statuses_module_1 = require("./statuses/statuses.module");
const telegram_module_1 = require("./telegram/telegram.module");
const test_module_1 = require("./test/test.module");
const users_module_1 = require("./users/users.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env',
                load: [configuration_1.default, telegram_config_1.default],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: database_config_1.getDatabaseConfig,
                inject: [config_1.ConfigService],
            }),
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    secret: configService.get('jwt.secret'),
                    signOptions: {
                        expiresIn: configService.get('jwt.accessExpiresIn'),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            cities_module_1.CitiesModule,
            statuses_module_1.StatusesModule,
            branches_module_1.BranchesModule,
            integrations_module_1.IntegrationsModule,
            candidates_module_1.CandidatesModule,
            sources_module_1.SourcesModule,
            test_module_1.TestModule,
            telegram_module_1.TelegramModule,
            analytics_module_1.AnalyticsModule,
        ],
        controllers: [],
        providers: [
            {
                provide: core_1.APP_GUARD,
                useClass: jwt_auth_guard_1.JwtAuthGuard,
            },
            {
                provide: core_1.APP_GUARD,
                useClass: roles_guard_1.RolesGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map