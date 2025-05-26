import { Document } from 'mongoose';
export declare class Source extends Document {
    name: string;
    description?: string;
}
export declare const SourceSchema: import("mongoose").Schema<Source, import("mongoose").Model<Source, any, any, any, Document<unknown, any, Source, any> & Source & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Source, Document<unknown, {}, import("mongoose").FlatRecord<Source>, {}> & import("mongoose").FlatRecord<Source> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
