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
var JwtAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
const public_decorator_1 = require("../../common/decorators/public.decorator");
let JwtAuthGuard = JwtAuthGuard_1 = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
        this.logger = new common_1.Logger(JwtAuthGuard_1.name);
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        this.logger.debug(`Перевірка JWT автентифікації для ${context.getClass().name}.${context.getHandler().name}`);
        this.logger.debug(`Публічний маршрут: ${isPublic}`);
        if (isPublic) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        this.logger.debug(`Заголовки запиту: ${JSON.stringify(request.headers)}`);
        try {
            const result = await super.canActivate(context);
            this.logger.debug(`Результат JWT автентифікації: ${result}`);
            return result;
        }
        catch (error) {
            this.logger.error(`Помилка JWT автентифікації: ${error.message}`, error.stack);
            throw new common_1.UnauthorizedException('Недійсний токен або токен не надано');
        }
    }
    handleRequest(err, user, info) {
        this.logger.debug(`Обробка JWT запиту - Користувач: ${JSON.stringify(user)}, Помилка: ${err}, Інфо: ${info}`);
        if (err || !user) {
            this.logger.error(`Помилка валідації JWT - Помилка: ${err}, Інфо: ${info}`);
            throw err || new common_1.UnauthorizedException('Неавторизований доступ');
        }
        return user;
    }
};
exports.JwtAuthGuard = JwtAuthGuard;
exports.JwtAuthGuard = JwtAuthGuard = JwtAuthGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
//# sourceMappingURL=jwt-auth.guard.js.map