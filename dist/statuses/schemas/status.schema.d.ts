import { Document } from 'mongoose';
export type StatusDocument = Status & Document;
export declare enum StatusType {
    INITIAL = "initial",
    INTERVIEW = "interview",
    FINAL = "final",
    OTHER = "other",
    CALLBACK = "callback"
}
export declare class Status {
    name: string;
    color: string;
    description?: string;
    order: number;
    type: StatusType;
    isDefault: boolean;
    isActive: boolean;
}
export declare const StatusSchema: import("mongoose").Schema<Status, import("mongoose").Model<Status, any, any, any, Document<unknown, any, Status, any> & Status & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Status, Document<unknown, {}, import("mongoose").FlatRecord<Status>, {}> & import("mongoose").FlatRecord<Status> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
