import { Document, Types } from 'mongoose';
export declare class Candidate extends Document {
    firstName: string;
    lastName: string;
    middleName: string;
    email: string;
    phone: string;
    age: number;
    position: string;
    salary: number;
    city: Types.ObjectId;
    source: Types.ObjectId;
    description: string;
    createdBy: Types.ObjectId;
    status: Types.ObjectId;
    callbackStatus: Types.ObjectId;
    callbackDescription: string;
    employmentType: string;
    gender: string;
    interviewDate: Date;
    integrationId: Types.ObjectId;
    isActive: boolean;
    resumeUrl: string;
    assignedRecruiter: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CandidateSchema: import("mongoose").Schema<Candidate, import("mongoose").Model<Candidate, any, any, any, Document<unknown, any, Candidate, any> & Candidate & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Candidate, Document<unknown, {}, import("mongoose").FlatRecord<Candidate>, {}> & import("mongoose").FlatRecord<Candidate> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
