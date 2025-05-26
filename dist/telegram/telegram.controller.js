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
var TelegramController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramController = void 0;
const common_1 = require("@nestjs/common");
const public_decorator_1 = require("../common/decorators/public.decorator");
const telegram_service_1 = require("./telegram.service");
let TelegramController = TelegramController_1 = class TelegramController {
    constructor(telegramService) {
        this.telegramService = telegramService;
        this.logger = new common_1.Logger(TelegramController_1.name);
    }
    async testNotification(candidate) {
        this.logger.debug(`Отримано тестове повідомлення для кандидата: ${JSON.stringify(candidate)}`);
        try {
            await this.telegramService.sendCandidateNotification(candidate, 'created');
            return {
                success: true,
                message: 'Notification sent successfully',
                candidate: candidate
            };
        }
        catch (error) {
            this.logger.error(`Помилка відправки повідомлення: ${error.message}`);
            return {
                success: false,
                message: 'Failed to send notification',
                error: error.message
            };
        }
    }
};
exports.TelegramController = TelegramController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('test'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TelegramController.prototype, "testNotification", null);
exports.TelegramController = TelegramController = TelegramController_1 = __decorate([
    (0, common_1.Controller)('telegram'),
    __metadata("design:paramtypes", [telegram_service_1.TelegramService])
], TelegramController);
//# sourceMappingURL=telegram.controller.js.map