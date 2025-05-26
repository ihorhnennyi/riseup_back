import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { EmploymentType } from '../../common/enums/employment-type.enum';
import { UserRole } from '../../common/enums/role.enum';
import { WorkSchedule } from '../../common/enums/work-schedule.enum';
export declare class User extends Document {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    city: Types.ObjectId;
    branch: Types.ObjectId;
    workSchedule: WorkSchedule;
    employmentType: EmploymentType;
    refreshToken: string;
    lastLogin: Date;
    isActive: boolean;
    isEmailVerified: boolean;
}
export declare const UserSchema: MongooseSchema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
