import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get recruitment dashboard data' })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Returns dashboard data' })
  async getDashboard(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.analyticsService.getRecruitmentDashboard(startDate, endDate);
  }

  @Get('sources')
  @ApiOperation({ summary: 'Get source analytics' })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Returns source analytics' })
  async getSourceAnalytics(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.analyticsService.getSourceAnalytics(startDate, endDate);
  }

  @Get('time-to-hire')
  @ApiOperation({ summary: 'Get time to hire metrics' })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Returns time to hire metrics' })
  async getTimeToHireMetrics(
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.analyticsService.getTimeToHireMetrics(startDate, endDate);
  }

  @Get('recruiter/:recruiterId')
  @ApiOperation({ summary: 'Get recruiter metrics' })
  @ApiQuery({ name: 'period', required: true, enum: ['daily', 'weekly', 'monthly'] })
  @ApiQuery({ name: 'startDate', required: true, type: Date })
  @ApiQuery({ name: 'endDate', required: true, type: Date })
  @ApiResponse({ status: 200, description: 'Returns recruiter metrics' })
  async getRecruiterMetrics(
    @Query('recruiterId') recruiterId: string,
    @Query('period') period: 'daily' | 'weekly' | 'monthly',
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.analyticsService.getRecruiterMetrics(
      recruiterId,
      period,
      startDate,
      endDate,
    );
  }

  @Get('user-status-stats')
  @ApiOperation({ summary: 'Статистика по статусам кандидатов для всех пользователей' })
  @ApiQuery({ name: 'userId', required: false, type: String })
  @ApiQuery({ name: 'fromDate', required: false, type: String })
  @ApiQuery({ name: 'toDate', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Статистика по статусам кандидатов для всех пользователей' })
  async getUserStatusStats(
    @Query('userId') userId?: string,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
  ) {
    return this.analyticsService.getUserStatusStats(userId, fromDate, toDate);
  }

  @Get('status-stats')
  @ApiQuery({ name: 'fromDate', required: true, type: String })
  @ApiQuery({ name: 'toDate', required: true, type: String })
  async getStatusStats(
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.analyticsService.getStatusStats(fromDate, toDate);
  }
} 