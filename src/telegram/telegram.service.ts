import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import axios from 'axios'
import { Model } from 'mongoose'
import { Candidate } from '../candidates/entities/candidate.schema'
import { City } from '../cities/entities/city.schema'
import { Status } from '../statuses/entities/status.schema'
import { User } from '../users/entities/user.schema'

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(City.name) private cityModel: Model<City>,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Status.name) private statusModel: Model<Status>,
  ) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
    
    // Debug logging
    this.logger.debug(`Bot Token: ${this.botToken ? 'Configured' : 'Not configured'}`);
    this.logger.debug(`Chat ID: ${this.chatId ? 'Configured' : 'Not configured'}`);
  }

  async sendCandidateNotification(candidate: Candidate, action: 'created' | 'updated'): Promise<void> {
    try {
      const city = await this.cityModel.findById(candidate.city).lean();
      const creator = await this.userModel.findById(candidate.createdBy).lean();
      const status = await this.statusModel.findById(candidate.status).lean();

      const message = this.formatCandidateMessage(candidate, action, city?.name, creator?.firstName, status?.name);
      await this.sendMessage(message);
    } catch (error) {
      this.logger.error(`Failed to send Telegram notification: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
    }
  }

  private formatCandidateMessage(
    candidate: Candidate, 
    action: 'created' | 'updated',
    cityName: string,
    creatorName: string,
    statusName: string
  ): string {
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

  private async sendMessage(message: string): Promise<void> {
    try {
      if (!this.botToken || !this.chatId) {
        throw new Error('Telegram bot token or chat ID not configured');
      }

      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      this.logger.debug(`Sending message to URL: ${url}`);
      
      const response = await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      });
      
      this.logger.debug(`Message sent successfully: ${response.status}`);
    } catch (error) {
      this.logger.error(`Failed to send message to Telegram: ${error.message}`);
      if (error.response) {
        this.logger.error(`Response data: ${JSON.stringify(error.response.data)}`);
      }
      throw error;
    }
  }
} 