import { Model } from 'mongoose';
import { CandidatesService } from '../candidates/candidates.service';
import { StatusesService } from '../statuses/statuses.service';
import { UsersService } from '../users/users.service';
import { RecruitmentMetrics } from './entities/recruitment-metrics.entity';
export declare class AnalyticsService {
    private recruitmentMetricsModel;
    private candidatesService;
    private usersService;
    private statusesService;
    private readonly logger;
    constructor(recruitmentMetricsModel: Model<RecruitmentMetrics>, candidatesService: CandidatesService, usersService: UsersService, statusesService: StatusesService);
    private getStatusName;
    calculateDailyMetrics(date?: Date): Promise<RecruitmentMetrics>;
    getRecruiterMetrics(recruiterId: string, period: 'daily' | 'weekly' | 'monthly', startDate: Date, endDate: Date): Promise<{
        period: "daily" | "weekly" | "monthly";
        startDate: Date;
        endDate: Date;
        metrics: {
            total: number;
            byStatus: Record<string, number>;
            calls: {
                total: number;
                successful: number;
                failed: number;
            };
            interviews: {
                scheduled: number;
                completed: number;
                noShow: number;
            };
            offers: {
                made: number;
                accepted: number;
                rejected: number;
            };
            hired: number;
            rejected: number;
            conversionRate: number;
        };
    }>;
    getSourceAnalytics(startDate: Date, endDate: Date): Promise<Record<string, {
        total: number;
        hired: number;
        conversionRate: number;
    }>>;
    getTimeToHireMetrics(startDate: Date, endDate: Date): Promise<{
        average: number;
        min: number;
        max: number;
        byPosition: Record<string, {
            total: number;
            count: number;
            average: number;
        }>;
    }>;
    getRecruitmentDashboard(startDate: Date, endDate: Date): Promise<{
        overview: {
            totalCandidates: number;
            activeCandidates: number;
            hiredCandidates: number;
            rejectionRate: number;
        };
        sourceAnalytics: Record<string, {
            total: number;
            hired: number;
            conversionRate: number;
        }>;
        timeToHireMetrics: {
            average: number;
            min: number;
            max: number;
            byPosition: Record<string, {
                total: number;
                count: number;
                average: number;
            }>;
        };
        statusDistribution: Record<string, number>;
        cityDistribution: Record<string, number>;
    }>;
    private calculateStatusDistribution;
    private calculateCityDistribution;
    getUserStatusStats(userId?: string, fromDate?: string, toDate?: string): Promise<{
        userId: any;
        userName: string;
        statuses: Record<string, number>;
    }[]>;
    getStatusStats(fromDate: string, toDate: string): Promise<{
        statusId: unknown;
        statusName: string;
        count: number;
    }[]>;
}
