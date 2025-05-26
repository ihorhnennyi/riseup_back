import { Document, Schema as MongooseSchema } from 'mongoose';
export type BranchDocument = Branch & Document;
export declare class Branch {
    id: string;
    name: string;
    description?: string;
    city: MongooseSchema.Types.ObjectId;
    isActive: boolean;
}
export declare const BranchSchema: MongooseSchema<Branch, import("mongoose").Model<Branch, any, any, any, Document<unknown, any, Branch, any> & Branch & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Branch, Document<unknown, {}, import("mongoose").FlatRecord<Branch>, {}> & import("mongoose").FlatRecord<Branch> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
