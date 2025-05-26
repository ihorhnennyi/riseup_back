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
var TelegramService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelegramService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const axios_1 = require("axios");
const mongoose_2 = require("mongoose");
const city_schema_1 = require("../cities/entities/city.schema");
const status_schema_1 = require("../statuses/entities/status.schema");
const user_schema_1 = require("../users/entities/user.schema");
let TelegramService = TelegramService_1 = class TelegramService {
    constructor(configService, cityModel, userModel, statusModel) {
        this.configService = configService;
        this.cityModel = cityModel;
        this.userModel = userModel;
        this.statusModel = statusModel;
        this.logger = new common_1.Logger(TelegramService_1.name);
        this.botToken = this.configService.get('TELEGRAM_BOT_TOKEN');
        this.chatId = this.configService.get('TELEGRAM_CHAT_ID');
        this.logger.debug(`Bot Token: ${this.botToken ? 'Configured' : 'Not configured'}`);
        this.logger.debug(`Chat ID: ${this.chatId ? 'Configured' : 'Not configured'}`);
    }
    async sendCandidateNotification(candidate, action) {
        try {
            const city = await this.cityModel.findById(candidate.city).lean();
            const creator = await this.userModel.findById(candidate.createdBy).lean();
            const status = await this.statusModel.findById(candidate.status).lean();
            const message = this.formatCandidateMessage(candidate, action, city === null || city === void 0 ? void 0 : city.name, creator === null || creator === void 0 ? void 0 : creator.firstName, status === null || status === void 0 ? void 0 : status.name);
            await this.sendMessage(message);
        }
        catch (error) {
            this.logger.error(`Failed to send Telegram notification: ${error.message}`);
            if (error.response) {
                this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
            }
        }
    }
    formatCandidateMessage(candidate, action, cityName, creatorName, statusName) {
        const actionEmoji = action === 'created' ? '🆕' : '📝';
        const actionText = action === 'created' ? 'создан' : 'обновлен';
        const createdAt = new Date(candidate.createdAt).toLocaleString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        return `
${actionEmoji} Кандидат ${actionText}!

👤 Имя: ${candidate.firstName} ${candidate.lastName} ${candidate.middleName || ''}
📧 Email: ${candidate.email || 'Не указан'}
📱 Телефон: ${candidate.phone || 'Не указан'}
🏢 Город: ${cityName || 'Не указан'}
💼 Позиция: ${candidate.position || 'Не указана'}
💰 Зарплата: ${candidate.salary ? `${candidate.salary} грн` : 'Не указана'}
📝 Описание: ${candidate.description || 'Нет описания'}
👥 Тип занятости: ${candidate.employmentType || 'Не указан'}
👨‍💼 Создал: ${creatorName || 'Не указан'}
📅 Дата интервью: ${candidate.interviewDate ? new Date(candidate.interviewDate).toLocaleDateString('uk-UA') : 'Не назначена'}
📊 Статус: ${statusName || 'Не указан'}
⏰ Создан: ${createdAt}
`;
    }
    async sendMessage(message) {
        try {
            if (!this.botToken || !this.chatId) {
                throw new Error('Telegram bot token or chat ID not configured');
            }
            const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
            this.logger.debug(`Sending message to URL: ${url}`);
            const response = await axios_1.default.post(url, {
                chat_id: this.chatId,
                text: message,
                parse_mode: 'HTML',
            });
            this.logger.debug(`Message sent successfully: ${response.status}`);
        }
        catch (error) {
            this.logger.error(`Failed to send message to Telegram: ${error.message}`);
            if (error.response) {
                this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
            }
            throw error;
        }
    }
};
exports.TelegramService = TelegramService;
exports.TelegramService = TelegramService = TelegramService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(city_schema_1.City.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(3, (0, mongoose_1.InjectModel)(status_schema_1.Status.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TelegramService);
//# sourceMappingURL=telegram.service.js.map