import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { StatusesService } from './statuses.service';
export declare class StatusesController {
    private readonly statusesService;
    constructor(statusesService: StatusesService);
    create(createStatusDto: CreateStatusDto): Promise<import("./entities/status.schema").Status>;
    findAll(): Promise<import("./entities/status.schema").Status[]>;
    getCallbackStatuses(): Promise<(import("mongoose").Document<unknown, {}, import("./entities/status.schema").Status, {}> & import("./entities/status.schema").Status & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("./entities/status.schema").Status>;
    update(id: string, updateStatusDto: UpdateStatusDto): Promise<import("./entities/status.schema").Status>;
    remove(id: string): Promise<import("./entities/status.schema").Status>;
    getDefaultStatus(): Promise<import("./entities/status.schema").Status>;
}
