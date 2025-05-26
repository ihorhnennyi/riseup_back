import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidatesModule } from '../candidates/candidates.module';
import { StatusesModule } from '../statuses/statuses.module';
import { UsersModule } from '../users/users.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { RecruitmentMetrics, RecruitmentMetricsSchema } from './entities/recruitment-metrics.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RecruitmentMetrics.name, schema: RecruitmentMetricsSchema },
    ]),
    CandidatesModule,
    UsersModule,
    StatusesModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {} 