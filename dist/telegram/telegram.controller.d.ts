import { Candidate } from '../candidates/entities/candidate.schema';
import { TelegramService } from './telegram.service';
export declare class TelegramController {
    private readonly telegramService;
    private readonly logger;
    constructor(telegramService: TelegramService);
    testNotification(candidate: Partial<Candidate>): Promise<{
        success: boolean;
        message: string;
        candidate: Partial<Candidate>;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        candidate?: undefined;
    }>;
}
