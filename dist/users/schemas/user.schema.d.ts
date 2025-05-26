import { Document, Schema as MongooseSchema } from 'mongoose';
import { UserRole } from '../../common/enums/role.enum';
export declare enum WorkSchedule {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    FLEXIBLE = "FLEXIBLE"
}
export declare enum EmploymentType {
    OFFICE = "OFFICE",
    REMOTE = "REMOTE",
    HYBRID = "HYBRID"
}
export type UserDocument = User & Document;
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone?: string;
    password: string;
    viber?: string;
    whatsapp?: string;
    facebook?: string;
    telegram?: string;
    role: UserRole;
    description?: string;
    position?: string;
    birthDate?: Date;
    age?: number;
    isActive: boolean;
    city: MongooseSchema.Types.ObjectId;
    branch: MongooseSchema.Types.ObjectId;
    photoUrl?: string;
    lastLogin?: Date;
    refreshToken?: string;
    passwordResetToken?: string;
    passwordResetExpires?: Date;
    languages?: string[];
    skills?: string[];
    workSchedule: WorkSchedule;
    employmentType: EmploymentType;
    startDate?: Date;
    experienceYears?: number;
    specializations?: string[];
    linkedinUrl?: string;
    identificationNumber?: string;
    certificates?: string[];
    supervisor?: string;
    responsibilities?: string[];
    emergencyContact?: string;
    preferences?: Record<string, any>;
}
export declare const UserSchema: MongooseSchema<User, import("mongoose").Model<User, any, any, any, Document<unknown, any, User, any> & User & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, User, Document<unknown, {}, import("mongoose").FlatRecord<User>, {}> & import("mongoose").FlatRecord<User> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
