import { registerAs } from '@nestjs/config';

export default registerAs('telegram', () => ({
  botToken: process.env.TELEGRAM_BOT_TOKEN || '7811077491:AAHJoZ-2Xgwm0LOdxtxm-h_McPSsL4QAvA0',
  chatId: process.env.TELEGRAM_CHAT_ID,
})); 