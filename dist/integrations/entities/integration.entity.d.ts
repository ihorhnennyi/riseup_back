import { Document } from 'mongoose';
export declare class Integration extends Document {
    name: string;
    url: string;
    description: string;
}
export declare const IntegrationSchema: import("mongoose").Schema<Integration, import("mongoose").Model<Integration, any, any, any, Document<unknown, any, Integration, any> & Integration & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Integration, Document<unknown, {}, import("mongoose").FlatRecord<Integration>, {}> & import("mongoose").FlatRecord<Integration> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
