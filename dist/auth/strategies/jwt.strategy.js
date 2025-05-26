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
var JwtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtStrategy = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const users_service_1 = require("../../users/users.service");
let JwtStrategy = JwtStrategy_1 = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, usersService) {
        const jwtSecret = configService.get('JWT_SECRET');
        if (!jwtSecret) {
            throw new Error('JWT_SECRET не визначено');
        }
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecret,
        });
        this.configService = configService;
        this.usersService = usersService;
        this.logger = new common_1.Logger(JwtStrategy_1.name);
    }
    async validate(payload) {
        this.logger.debug(`Валідація JWT даних: ${JSON.stringify(payload)}`);
        try {
            const userResponse = await this.usersService.findById(payload.sub);
            if (!userResponse || !userResponse.data) {
                this.logger.error(`Користувача не знайдено для даних: ${JSON.stringify(payload)}`);
                throw new common_1.UnauthorizedException('Користувача не знайдено');
            }
            if (!userResponse.data.isActive) {
                this.logger.error(`Користувач ${payload.sub} неактивний`);
                throw new common_1.UnauthorizedException('Користувач неактивний');
            }
            const user = Object.assign({ id: payload.sub, email: payload.email, role: payload.role }, userResponse.data);
            this.logger.debug(`Успішна валідація користувача: ${JSON.stringify({ id: user.id, email: user.email, role: user.role })}`);
            return user;
        }
        catch (error) {
            this.logger.error(`Помилка валідації токена: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = JwtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        users_service_1.UsersService])
], JwtStrategy);
//# sourceMappingURL=jwt.strategy.js.map