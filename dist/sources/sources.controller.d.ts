import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { SourcesService } from './sources.service';
export declare class SourcesController {
    private readonly sourcesService;
    constructor(sourcesService: SourcesService);
    create(createSourceDto: CreateSourceDto): Promise<import("./entities/source.schema").Source>;
    findAll(): Promise<import("./entities/source.schema").Source[]>;
    findOne(id: string): Promise<import("./entities/source.schema").Source>;
    update(id: string, updateSourceDto: UpdateSourceDto): Promise<import("./entities/source.schema").Source>;
    remove(id: string): Promise<import("./entities/source.schema").Source>;
}
