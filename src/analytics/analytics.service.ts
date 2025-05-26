import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { CandidatesService } from '../candidates/candidates.service'
import { Candidate } from '../candidates/entities/candidate.schema'
import { UserRole } from '../common/enums/role.enum'
import { StatusesService } from '../statuses/statuses.service'
import { UsersService } from '../users/users.service'
import { RecruitmentMetrics } from './entities/recruitment-metrics.entity'

interface Status {
  _id: Types.ObjectId;
  name: string;
  color?: string;
  description?: string;
}

interface PopulatedCandidate extends Omit<Candidate, 'callbackStatus'> {
  callbackStatus?: Status;
}

interface CandidateWithTimestamps extends PopulatedCandidate {
  createdAt: Date;
  updatedAt: Date;
}

type CandidatesResponse = {
  data: PopulatedCandidate[];
  total: number;
  page: number;
  totalPages: number;
};

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(
    @InjectModel(RecruitmentMetrics.name)
    private recruitmentMetricsModel: Model<RecruitmentMetrics>,
    private candidatesService: CandidatesService,
    private usersService: UsersService,
    private statusesService: StatusesService,
  ) {}

  private getStatusName(status: Status | undefined): string | undefined {
    return status?.name;
  }

  async calculateDailyMetrics(date: Date = new Date()): Promise<RecruitmentMetrics> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const candidates = await this.candidatesService.findAll({
      fromDate: startOfDay,
      toDate: endOfDay,
    }) as unknown as CandidatesResponse;

    const metrics = new this.recruitmentMetricsModel({
      period: 'daily',
      date: startOfDay,
      totalCandidates: candidates.total,
      newCandidates: candidates.data.filter(c => new Date((c as CandidateWithTimestamps).createdAt) >= startOfDay).length,
    });

    return metrics.save();
  }

  async getRecruiterMetrics(
    recruiterId: string,
    period: 'daily' | 'weekly' | 'monthly',
    startDate: Date,
    endDate: Date,
  ) {
    const candidates = await this.candidatesService.findAll({
      fromDate: startDate,
      toDate: endDate,
    }) as unknown as CandidatesResponse;

    const recruiterCandidates = candidates.data.filter(c => 
      c.assignedRecruiter && c.assignedRecruiter.toString() === recruiterId
    );
    
    const statusMetrics = {
      total: recruiterCandidates.length,
      byStatus: this.calculateStatusDistribution(recruiterCandidates),
      calls: {
        total: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'called').length,
        successful: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'called' && c.callbackDescription?.includes('successful')).length,
        failed: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'called' && c.callbackDescription?.includes('failed')).length,
      },
      interviews: {
        scheduled: recruiterCandidates.filter(c => c.interviewDate).length,
        completed: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'interview_completed').length,
        noShow: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'interview_completed' && c.callbackDescription?.includes('no_show')).length,
      },
      offers: {
        made: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'offer_made').length,
        accepted: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'offer_accepted').length,
        rejected: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'offer_rejected').length,
      },
      hired: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'hired').length,
      rejected: recruiterCandidates.filter(c => this.getStatusName(c.callbackStatus) === 'rejected').length,
      conversionRate: 0,
    };

    // Рассчитываем конверсию (отношение принятых к общему числу кандидатов)
    statusMetrics.conversionRate = (statusMetrics.hired / statusMetrics.total) * 100;

    return {
      period,
      startDate,
      endDate,
      metrics: statusMetrics,
    };
  }

  async getSourceAnalytics(startDate: Date, endDate: Date) {
    const candidates = await this.candidatesService.findAll({
      fromDate: startDate,
      toDate: endDate,
    }) as unknown as CandidatesResponse;

    const sourceMetrics: Record<string, { total: number; hired: number; conversionRate: number }> = {};
    
    candidates.data.forEach(candidate => {
      const sourceId = candidate.source?.toString() || 'unknown';
      if (!sourceMetrics[sourceId]) {
        sourceMetrics[sourceId] = {
          total: 0,
          hired: 0,
          conversionRate: 0,
        };
      }
      sourceMetrics[sourceId].total++;
      if (this.getStatusName(candidate.callbackStatus) === 'hired') {
        sourceMetrics[sourceId].hired++;
      }
    });

    // Рассчитываем конверсию
    Object.keys(sourceMetrics).forEach(source => {
      const metrics = sourceMetrics[source];
      metrics.conversionRate = (metrics.hired / metrics.total) * 100;
    });

    return sourceMetrics;
  }

  async getTimeToHireMetrics(startDate: Date, endDate: Date) {
    const candidates = await this.candidatesService.findAll({
      fromDate: startDate,
      toDate: endDate,
    }) as unknown as CandidatesResponse;

    const hiredCandidates = candidates.data.filter(c => this.getStatusName(c.callbackStatus) === 'hired');
    const timeToHireMetrics = {
      average: 0,
      min: Infinity,
      max: 0,
      byPosition: {} as Record<string, { total: number; count: number; average: number }>,
    };

    if (hiredCandidates.length > 0) {
      let totalTime = 0;
      hiredCandidates.forEach(candidate => {
        const candidateWithTimestamps = candidate as CandidateWithTimestamps;
        const timeToHire = (new Date(candidateWithTimestamps.updatedAt).getTime() - new Date(candidateWithTimestamps.createdAt).getTime()) / (1000 * 60 * 60); // в часах
        totalTime += timeToHire;
        timeToHireMetrics.min = Math.min(timeToHireMetrics.min, timeToHire);
        timeToHireMetrics.max = Math.max(timeToHireMetrics.max, timeToHire);

        // Метрики по позициям
        const position = candidate.position || 'unknown';
        if (!timeToHireMetrics.byPosition[position]) {
          timeToHireMetrics.byPosition[position] = {
            total: 0,
            count: 0,
            average: 0,
          };
        }
        timeToHireMetrics.byPosition[position].total += timeToHire;
        timeToHireMetrics.byPosition[position].count++;
      });

      timeToHireMetrics.average = totalTime / hiredCandidates.length;

      // Рассчитываем среднее время по позициям
      Object.keys(timeToHireMetrics.byPosition).forEach(position => {
        const metrics = timeToHireMetrics.byPosition[position];
        metrics.average = metrics.total / metrics.count;
      });
    }

    return timeToHireMetrics;
  }

  async getRecruitmentDashboard(startDate: Date, endDate: Date) {
    const [
      sourceAnalytics,
      timeToHireMetrics,
      candidates,
    ] = await Promise.all([
      this.getSourceAnalytics(startDate, endDate),
      this.getTimeToHireMetrics(startDate, endDate),
      this.candidatesService.findAll({
        fromDate: startDate,
        toDate: endDate,
      }) as Promise<unknown> as Promise<CandidatesResponse>,
    ]);

    return {
      overview: {
        totalCandidates: candidates.total,
        activeCandidates: candidates.data.filter(c => {
          const status = this.getStatusName(c.callbackStatus);
          return status !== 'hired' && status !== 'rejected';
        }).length,
        hiredCandidates: candidates.data.filter(c => this.getStatusName(c.callbackStatus) === 'hired').length,
        rejectionRate: (candidates.data.filter(c => this.getStatusName(c.callbackStatus) === 'rejected').length / candidates.total) * 100,
      },
      sourceAnalytics,
      timeToHireMetrics,
      statusDistribution: this.calculateStatusDistribution(candidates.data),
      cityDistribution: this.calculateCityDistribution(candidates.data),
    };
  }

  private calculateStatusDistribution(candidates: PopulatedCandidate[]) {
    const distribution: Record<string, number> = {};
    candidates.forEach(candidate => {
      const status = this.getStatusName(candidate.callbackStatus) || String(candidate.callbackStatus);
      if (!distribution[status]) {
        distribution[status] = 0;
      }
      distribution[status]++;
    });
    return distribution;
  }

  private calculateCityDistribution(candidates: PopulatedCandidate[]) {
    const distribution: Record<string, number> = {};
    candidates.forEach(candidate => {
      const cityId = candidate.city?.toString() || 'unknown';
      if (!distribution[cityId]) {
        distribution[cityId] = 0;
      }
      distribution[cityId]++;
    });
    return distribution;
  }

  async getUserStatusStats(userId?: string, fromDate?: string, toDate?: string) {
    // Получаем всех пользователей или одного
    let users = await this.usersService.findAll({}, UserRole.SUPER_ADMIN);
    if (userId) {
      users.data = users.data.filter((u: any) => u._id?.toString() === userId);
    }
    // Получаем все статусы
    const statuses = await this.statusesService.findAll();
    // Получаем всех кандидатов с фильтрацией по updatedAt
    const candidateQuery: any = {};
    if (fromDate || toDate) {
      candidateQuery.updatedAt = {};
      if (fromDate) candidateQuery.updatedAt.$gte = new Date(fromDate);
      if (toDate) candidateQuery.updatedAt.$lte = new Date(toDate);
    }
    const candidatesRes = await this.candidatesService.findAll(candidateQuery);
    const candidates = candidatesRes.data;

    // Формируем статистику
    const result = users.data.map((user: any) => {
      const userIdStr = user._id?.toString();
      const userCandidates = candidates.filter((c: any) => {
        const createdById = typeof c.createdBy === 'object' && c.createdBy !== null
          ? c.createdBy._id?.toString()
          : c.createdBy?.toString();
        return createdById === userIdStr;
      });
      const statusesCount: Record<string, number> = {};
      statuses.forEach((st: any) => {
        const statusId = st._id?.toString();
        statusesCount[st._id] = userCandidates.filter((c: any) => {
          const candidateStatusId = typeof c.status === 'object' && c.status !== null
            ? c.status._id?.toString()
            : c.status?.toString();
          return candidateStatusId === statusId;
        }).length;
      });
      return {
        userId: user._id,
        userName: [user.firstName, user.lastName].filter(Boolean).join(' '),
        statuses: statusesCount,
      };
    });
    return result;
  }

  async getStatusStats(fromDate: string, toDate: string) {
    const candidates = await this.candidatesService.findAll({
      updatedAt: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate),
      }
    });
    const statuses = await this.statusesService.findAll();
    const stats = statuses.map(st => ({
      statusId: st._id,
      statusName: st.name,
      count: candidates.data.filter(c => {
        const statusId = typeof c.status === 'object' ? String(c.status._id) : String(c.status);
        return statusId === String(st._id);
      }).length
    }));
    return stats;
  }
} 