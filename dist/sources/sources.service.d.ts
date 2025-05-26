import { Model } from 'mongoose';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { Source } from './entities/source.schema';
export declare class SourcesService {
    private sourceModel;
    constructor(sourceModel: Model<Source>);
    create(createSourceDto: CreateSourceDto): Promise<Source>;
    findAll(): Promise<Source[]>;
    findOne(id: string): Promise<Source>;
    update(id: string, updateSourceDto: UpdateSourceDto): Promise<Source>;
    remove(id: string): Promise<Source>;
}
