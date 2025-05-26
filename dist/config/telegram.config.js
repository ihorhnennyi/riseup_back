"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('telegram', () => ({
    botToken: process.env.TELEGRAM_BOT_TOKEN || '7811077491:AAHJoZ-2Xgwm0LOdxtxm-h_McPSsL4QAvA0',
    chatId: process.env.TELEGRAM_CHAT_ID,
}));
//# sourceMappingURL=telegram.config.js.map