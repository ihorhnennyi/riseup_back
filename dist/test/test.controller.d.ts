import { TestService } from './test.service';
export declare class TestController {
    private readonly testService;
    constructor(testService: TestService);
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
}
