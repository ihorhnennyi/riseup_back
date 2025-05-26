import { Document, Types } from 'mongoose';
export declare class RecruitmentMetrics extends Document {
    recruiterId: Types.ObjectId;
    period: string;
    date: Date;
    totalCandidates: number;
    newCandidates: number;
    interviewsScheduled: number;
    interviewsCompleted: number;
    offersMade: number;
    offersAccepted: number;
    averageTimeToFirstInterview: number;
    averageTimeToOffer: number;
    averageTimeToHire: number;
    sourceMetrics: {
        [key: string]: {
            total: number;
            hired: number;
            conversionRate: number;
        };
    };
    statusMetrics: {
        [key: string]: number;
    };
    cityMetrics: {
        [key: string]: number;
    };
    positionMetrics: {
        [key: string]: {
            total: number;
            hired: number;
            averageTimeToHire: number;
        };
    };
}
export declare const RecruitmentMetricsSchema: import("mongoose").Schema<RecruitmentMetrics, import("mongoose").Model<RecruitmentMetrics, any, any, any, Document<unknown, any, RecruitmentMetrics, any> & RecruitmentMetrics & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, RecruitmentMetrics, Document<unknown, {}, import("mongoose").FlatRecord<RecruitmentMetrics>, {}> & import("mongoose").FlatRecord<RecruitmentMetrics> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
