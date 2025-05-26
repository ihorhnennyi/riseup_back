import { Model } from 'mongoose';
import { BranchDocument } from '../branches/schemas/branch.schema';
import { Candidate } from '../candidates/entities/candidate.schema';
import { CityDocument } from '../cities/schemas/city.schema';
import { Source } from '../sources/schemas/source.schema';
import { StatusDocument } from '../statuses/schemas/status.schema';
import { UserDocument } from '../users/schemas/user.schema';
export declare class TestService {
    private userModel;
    private candidateModel;
    private cityModel;
    private statusModel;
    private sourceModel;
    private branchModel;
    private readonly logger;
    constructor(userModel: Model<UserDocument>, candidateModel: Model<Candidate>, cityModel: Model<CityDocument>, statusModel: Model<StatusDocument>, sourceModel: Model<Source>, branchModel: Model<BranchDocument>);
    seedTestData(): Promise<{
        message: string;
        counts: {
            cities: number;
            branch: number;
            statuses: number;
            sources: number;
            users: number;
            candidates: number;
        };
    }>;
    private clearAllData;
    private createTestCities;
    private createTestBranch;
    private createTestStatuses;
    private createTestSources;
    private createTestUsers;
    private createTestCandidates;
}
