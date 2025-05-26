import { Body, Controller, Logger, Post } from '@nestjs/common';
import { Candidate } from '../candidates/entities/candidate.schema';
import { Public } from '../common/decorators/public.decorator';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  private readonly logger = new Logger(TelegramController.name);

  constructor(private readonly telegramService: TelegramService) {}

  @Public()
  @Post('test')
  async testNotification(@Body() candidate: Partial<Candidate>) {
    this.logger.debug(`Отримано тестове повідомлення для кандидата: ${JSON.stringify(candidate)}`);
    try {
      await this.telegramService.sendCandidateNotification(candidate as Candidate, 'created');
      return { 
        success: true,
        message: 'Notification sent successfully',
        candidate: candidate
      };
    } catch (error) {
      this.logger.error(`Помилка відправки повідомлення: ${error.message}`);
      return {
        success: false,
        message: 'Failed to send notification',
        error: error.message
      };
    }
  }
} 