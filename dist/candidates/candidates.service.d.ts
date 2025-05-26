import { Model } from 'mongoose';
import { TelegramService } from '../telegram/telegram.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
import { Candidate } from './entities/candidate.schema';
export declare class CandidatesService {
    private candidateModel;
    private readonly telegramService;
    private readonly logger;
    constructor(candidateModel: Model<Candidate>, telegramService: TelegramService);
    private toObjectId;
    private normalizeRefs;
    create(createCandidateDto: CreateCandidateDto): Promise<Candidate>;
    private validateObjectId;
    private paginateQuery;
    findAll(query?: any): Promise<{
        data: Candidate[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<Candidate>;
    update(id: string, updateCandidateDto: UpdateCandidateDto): Promise<Candidate>;
    remove(id: string): Promise<Candidate>;
    updateStatus(candidateId: string, newStatus: string): Promise<Candidate>;
    findDuplicateByName(firstName: string, lastName: string): Promise<Candidate | null>;
}
