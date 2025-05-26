import { Document } from 'mongoose';
export declare class City extends Document {
    name: string;
    description: string;
    isActive: boolean;
}
export declare const CitySchema: import("mongoose").Schema<City, import("mongoose").Model<City, any, any, any, Document<unknown, any, City, any> & City & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, City, Document<unknown, {}, import("mongoose").FlatRecord<City>, {}> & import("mongoose").FlatRecord<City> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
