import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private usersService;
    private readonly logger;
    constructor(configService: ConfigService, usersService: UsersService);
    validate(payload: any): Promise<{
        email: any;
        password?: string;
        firstName?: string;
        lastName?: string;
        middleName?: string;
        role: any;
        city?: import("mongoose").Types.ObjectId;
        branch?: import("mongoose").Types.ObjectId;
        workSchedule?: import("../../common/enums/work-schedule.enum").WorkSchedule;
        employmentType?: import("../../common/enums/employment-type.enum").EmploymentType;
        refreshToken?: string;
        lastLogin?: Date;
        isActive?: boolean;
        isEmailVerified?: boolean;
        languages?: string[];
        skills?: string[];
        specializations?: string[];
        certificates?: string[];
        responsibilities?: string[];
        viber?: string;
        whatsapp?: string;
        facebook?: string;
        telegram?: string;
        description?: string;
        position?: string;
        birthDate?: Date;
        photoUrl?: string;
        linkedinUrl?: string;
        identificationNumber?: string;
        supervisor?: string;
        emergencyContact?: string;
        startDate?: Date;
        experienceYears?: number;
        _id?: unknown;
        $assertPopulated?: <Paths = {}>(path: string | string[], values?: Partial<Paths>) => Omit<import("../../users/entities/user.entity").User, keyof Paths> & Paths;
        $clearModifiedPaths?: () => import("../../users/entities/user.entity").User;
        $clone?: () => import("../../users/entities/user.entity").User;
        $createModifiedPathsSnapshot?: () => import("mongoose").ModifiedPathsSnapshot;
        $getAllSubdocs?: () => import("mongoose").Document[];
        $ignore?: (path: string) => void;
        $isDefault?: (path: string) => boolean;
        $isDeleted?: (val?: boolean) => boolean;
        $getPopulatedDocs?: () => import("mongoose").Document[];
        $inc?: (path: string | string[], val?: number) => import("../../users/entities/user.entity").User;
        $isEmpty?: (path: string) => boolean;
        $isValid?: (path: string) => boolean;
        $locals?: Record<string, unknown>;
        $markValid?: (path: string) => void;
        $model?: {
            <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown, {}> & Required<{
                _id: unknown;
            }> & {
                __v: number;
            }, any>>(name: string): ModelType;
            <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
        };
        $op?: "save" | "validate" | "remove" | null;
        $restoreModifiedPathsSnapshot?: (snapshot: import("mongoose").ModifiedPathsSnapshot) => import("../../users/entities/user.entity").User;
        $session?: (session?: import("mongoose").ClientSession | null) => import("mongoose").ClientSession | null;
        $set?: {
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("../../users/entities/user.entity").User;
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("../../users/entities/user.entity").User;
            (value: string | Record<string, any>): import("../../users/entities/user.entity").User;
        };
        $where?: Record<string, unknown>;
        baseModelName?: string;
        collection?: import("mongoose").Collection;
        db?: import("mongoose").Connection;
        deleteOne?: (options?: import("mongoose").QueryOptions) => any;
        depopulate?: <Paths = {}>(path?: string | string[]) => import("mongoose").MergeType<import("../../users/entities/user.entity").User, Paths>;
        directModifiedPaths?: () => Array<string>;
        equals?: (doc: import("mongoose").Document<unknown, any, any, Record<string, any>>) => boolean;
        errors?: import("mongoose").Error.ValidationError;
        get?: {
            <T extends string | number | symbol>(path: T, type?: any, options?: any): any;
            (path: string, type?: any, options?: any): any;
        };
        getChanges?: () => import("mongoose").UpdateQuery<import("../../users/entities/user.entity").User>;
        id: any;
        increment?: () => import("../../users/entities/user.entity").User;
        init?: (obj: import("mongoose").AnyObject, opts?: import("mongoose").AnyObject) => import("../../users/entities/user.entity").User;
        invalidate?: {
            <T extends string | number | symbol>(path: T, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
            (path: string, errorMsg: string | NativeError, value?: any, kind?: string): NativeError | null;
        };
        isDirectModified?: {
            <T extends string | number | symbol>(path: T | T[]): boolean;
            (path: string | Array<string>): boolean;
        };
        isDirectSelected?: {
            <T extends string | number | symbol>(path: T): boolean;
            (path: string): boolean;
        };
        isInit?: {
            <T extends string | number | symbol>(path: T): boolean;
            (path: string): boolean;
        };
        isModified?: {
            <T extends string | number | symbol>(path?: T | T[], options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
            (path?: string | Array<string>, options?: {
                ignoreAtomics?: boolean;
            } | null): boolean;
        };
        isNew?: boolean;
        isSelected?: {
            <T extends string | number | symbol>(path: T): boolean;
            (path: string): boolean;
        };
        markModified?: {
            <T extends string | number | symbol>(path: T, scope?: any): void;
            (path: string, scope?: any): void;
        };
        model?: {
            <ModelType = import("mongoose").Model<unknown, {}, {}, {}, import("mongoose").Document<unknown, {}, unknown, {}> & Required<{
                _id: unknown;
            }> & {
                __v: number;
            }, any>>(name: string): ModelType;
            <ModelType = import("mongoose").Model<any, {}, {}, {}, any, any>>(): ModelType;
        };
        modifiedPaths?: (options?: {
            includeChildren?: boolean;
        }) => Array<string>;
        overwrite?: (obj: import("mongoose").AnyObject) => import("../../users/entities/user.entity").User;
        $parent?: () => import("mongoose").Document | undefined;
        populate?: {
            <Paths = {}>(path: string | import("mongoose").PopulateOptions | (string | import("mongoose").PopulateOptions)[]): Promise<import("mongoose").MergeType<import("../../users/entities/user.entity").User, Paths>>;
            <Paths = {}>(path: string, select?: string | import("mongoose").AnyObject, model?: import("mongoose").Model<any>, match?: import("mongoose").AnyObject, options?: import("mongoose").PopulateOptions): Promise<import("mongoose").MergeType<import("../../users/entities/user.entity").User, Paths>>;
        };
        populated?: (path: string) => any;
        replaceOne?: (replacement?: import("mongoose").AnyObject, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("../../users/entities/user.entity").User, {}, unknown, "find", Record<string, never>>;
        save?: (options?: import("mongoose").SaveOptions) => Promise<import("../../users/entities/user.entity").User>;
        schema?: import("mongoose").Schema;
        set?: {
            <T extends string | number | symbol>(path: T, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("../../users/entities/user.entity").User;
            (path: string | Record<string, any>, val: any, type: any, options?: import("mongoose").DocumentSetOptions): import("../../users/entities/user.entity").User;
            (path: string | Record<string, any>, val: any, options?: import("mongoose").DocumentSetOptions): import("../../users/entities/user.entity").User;
            (value: string | Record<string, any>): import("../../users/entities/user.entity").User;
        };
        toJSON?: {
            (options: import("mongoose").ToObjectOptions & {
                virtuals: true;
            }): any;
            (options?: import("mongoose").ToObjectOptions & {
                flattenMaps?: true;
                flattenObjectIds?: false;
            }): import("mongoose").FlattenMaps<any>;
            (options: import("mongoose").ToObjectOptions & {
                flattenObjectIds: false;
            }): import("mongoose").FlattenMaps<any>;
            (options: import("mongoose").ToObjectOptions & {
                flattenObjectIds: true;
            }): {
                [x: string]: any;
            };
            (options: import("mongoose").ToObjectOptions & {
                flattenMaps: false;
            }): any;
            (options: import("mongoose").ToObjectOptions & {
                flattenMaps: false;
                flattenObjectIds: true;
            }): any;
            <T = any>(options?: import("mongoose").ToObjectOptions & {
                flattenMaps?: true;
                flattenObjectIds?: false;
            }): import("mongoose").FlattenMaps<T>;
            <T = any>(options: import("mongoose").ToObjectOptions & {
                flattenObjectIds: false;
            }): import("mongoose").FlattenMaps<T>;
            <T = any>(options: import("mongoose").ToObjectOptions & {
                flattenObjectIds: true;
            }): import("mongoose").ObjectIdToString<import("mongoose").FlattenMaps<T>>;
            <T = any>(options: import("mongoose").ToObjectOptions & {
                flattenMaps: false;
            }): T;
            <T = any>(options: import("mongoose").ToObjectOptions & {
                flattenMaps: false;
                flattenObjectIds: true;
            }): import("mongoose").ObjectIdToString<T>;
        };
        toObject?: {
            (options: import("mongoose").ToObjectOptions & {
                virtuals: true;
            }): any;
            (options?: import("mongoose").ToObjectOptions): any;
            <T>(options?: import("mongoose").ToObjectOptions): import("mongoose").Default__v<import("mongoose").Require_id<T>>;
        };
        unmarkModified?: {
            <T extends string | number | symbol>(path: T): void;
            (path: string): void;
        };
        updateOne?: (update?: import("mongoose").UpdateWithAggregationPipeline | import("mongoose").UpdateQuery<import("../../users/entities/user.entity").User>, options?: import("mongoose").QueryOptions | null) => import("mongoose").Query<any, import("../../users/entities/user.entity").User, {}, unknown, "find", Record<string, never>>;
        validate?: {
            <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): Promise<void>;
            (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): Promise<void>;
            (options: {
                pathsToSkip?: import("mongoose").pathsToSkip;
            }): Promise<void>;
        };
        validateSync?: {
            (options: {
                pathsToSkip?: import("mongoose").pathsToSkip;
                [k: string]: any;
            }): import("mongoose").Error.ValidationError | null;
            <T extends string | number | symbol>(pathsToValidate?: T | T[], options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
            (pathsToValidate?: import("mongoose").pathsToValidate, options?: import("mongoose").AnyObject): import("mongoose").Error.ValidationError | null;
        };
    }>;
}
export {};
