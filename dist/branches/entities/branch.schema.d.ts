import { Document, Types } from 'mongoose';
export declare class Branch extends Document {
    name: string;
    city: Types.ObjectId;
    description: string;
    address: string;
    phone: string;
    email: string;
    isActive: boolean;
}
export declare const BranchSchema: import("mongoose").Schema<Branch, import("mongoose").Model<Branch, any, any, any, Document<unknown, any, Branch, any> & Branch & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Branch, Document<unknown, {}, import("mongoose").FlatRecord<Branch>, {}> & import("mongoose").FlatRecord<Branch> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
