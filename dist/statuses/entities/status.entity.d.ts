import { Document } from 'mongoose';
export declare class Status extends Document {
    name: string;
    description: string;
    isActive: boolean;
    order: number;
    color: string;
    isDefault: boolean;
    type: string;
}
export declare const StatusSchema: import("mongoose").Schema<Status, import("mongoose").Model<Status, any, any, any, Document<unknown, any, Status, any> & Status & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Status, Document<unknown, {}, import("mongoose").FlatRecord<Status>, {}> & import("mongoose").FlatRecord<Status> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
