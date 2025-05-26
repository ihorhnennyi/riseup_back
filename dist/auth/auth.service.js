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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, configService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async login(loginDto) {
        const user = await this.usersService.findByEmail(loginDto.email);
        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Невірні облікові дані');
        }
        if (!user.isActive) {
            throw new common_1.UnauthorizedException('Користувач неактивний');
        }
        const tokens = await this.generateTokens(user);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        const userInfo = {
            id: user._id ? user._id.toString() : user.id,
            firstName: user.firstName,
            role: user.role
        };
        return {
            success: true,
            message: `Ласкаво просимо, ${user.firstName}!`,
            data: {
                user: userInfo,
                tokens,
            },
        };
    }
    async generateTokens(user) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: user._id.toString(),
                email: user.email,
                role: user.role,
            }, {
                secret: this.configService.get('jwt.secret'),
                expiresIn: this.configService.get('jwt.accessExpiresIn'),
            }),
            this.jwtService.signAsync({
                sub: user._id.toString(),
                email: user.email,
                role: user.role,
            }, {
                secret: this.configService.get('jwt.secret'),
                expiresIn: this.configService.get('jwt.refreshExpiresIn'),
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async updateRefreshToken(userId, refreshToken) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.updateRefreshToken(userId, hashedRefreshToken);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map