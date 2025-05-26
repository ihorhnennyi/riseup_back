import { Document, Types } from 'mongoose';
export declare class UserIntegration extends Document {
    name: string;
    login: string;
    password: string;
    userId: Types.ObjectId;
    integrationId: Types.ObjectId;
}
export declare const UserIntegrationSchema: import("mongoose").Schema<UserIntegration, import("mongoose").Model<UserIntegration, any, any, any, Document<unknown, any, UserIntegration, any> & UserIntegration & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, UserIntegration, Document<unknown, {}, import("mongoose").FlatRecord<UserIntegration>, {}> & import("mongoose").FlatRecord<UserIntegration> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
