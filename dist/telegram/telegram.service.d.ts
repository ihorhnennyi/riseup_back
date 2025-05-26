import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Candidate } from '../candidates/entities/candidate.schema';
import { City } from '../cities/entities/city.schema';
import { Status } from '../statuses/entities/status.schema';
import { User } from '../users/entities/user.schema';
export declare class TelegramService {
    private readonly configService;
    private cityModel;
    private userModel;
    private statusModel;
    private readonly logger;
    private readonly botToken;
    private readonly chatId;
    constructor(configService: ConfigService, cityModel: Model<City>, userModel: Model<User>, statusModel: Model<Status>);
    sendCandidateNotification(candidate: Candidate, action: 'created' | 'updated'): Promise<void>;
    private formatCandidateMessage;
    private sendMessage;
}
