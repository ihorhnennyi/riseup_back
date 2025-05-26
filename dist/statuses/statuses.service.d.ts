import { Model } from 'mongoose';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.schema';
export declare class StatusesService {
    private statusModel;
    constructor(statusModel: Model<Status>);
    create(createStatusDto: CreateStatusDto): Promise<Status>;
    findAll(): Promise<Status[]>;
    findOne(id: string): Promise<Status>;
    update(id: string, updateStatusDto: UpdateStatusDto): Promise<Status>;
    remove(id: string): Promise<Status>;
    findByIds(ids: string[]): Promise<Status[]>;
    findByName(name: string): Promise<Status[]>;
    updateOrder(ids: string[]): Promise<Status[]>;
    getDefaultStatus(): Promise<Status>;
    private resetDefaultStatus;
    getCallbackStatuses(): Promise<(import("mongoose").Document<unknown, {}, Status, {}> & Status & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
