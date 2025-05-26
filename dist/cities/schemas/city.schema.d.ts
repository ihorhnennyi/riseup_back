import { Document } from 'mongoose';
export type CityDocument = City & Document;
export declare class City {
    name: string;
    latitude?: number;
    longitude?: number;
    isActive: boolean;
}
export declare const CitySchema: import("mongoose").Schema<City, import("mongoose").Model<City, any, any, any, Document<unknown, any, City, any> & City & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, City, Document<unknown, {}, import("mongoose").FlatRecord<City>, {}> & import("mongoose").FlatRecord<City> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
