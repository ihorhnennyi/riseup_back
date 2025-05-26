import { CandidatesService } from './candidates.service';
import { CreateCandidateDto } from './dto/create-candidate.dto';
import { UpdateCandidateDto } from './dto/update-candidate.dto';
export declare class CandidatesController {
    private readonly candidatesService;
    constructor(candidatesService: CandidatesService);
    create(createCandidateDto: CreateCandidateDto): Promise<import("./entities/candidate.schema").Candidate>;
    findAll(query: any): Promise<{
        data: import("./entities/candidate.schema").Candidate[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    checkDuplicate(query: any): Promise<{
        exists: boolean;
        candidate: import("./entities/candidate.schema").Candidate;
    }>;
    findOne(id: string): Promise<import("./entities/candidate.schema").Candidate>;
    update(id: string, updateCandidateDto: UpdateCandidateDto): Promise<import("./entities/candidate.schema").Candidate>;
    remove(id: string): Promise<import("./entities/candidate.schema").Candidate>;
    updateStatus(id: string, status: string): Promise<import("./entities/candidate.schema").Candidate>;
    updateCallbackStatus(id: string, callbackStatus: string): Promise<import("./entities/candidate.schema").Candidate>;
    updateSource(id: string, source: string): Promise<import("./entities/candidate.schema").Candidate>;
}
