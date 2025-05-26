import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
export declare class BranchesController {
    private readonly branchesService;
    constructor(branchesService: BranchesService);
    create(createBranchDto: CreateBranchDto): Promise<import("./entities/branch.schema").Branch>;
    findAll(): Promise<import("./entities/branch.schema").Branch[]>;
    findOne(id: string): Promise<import("./entities/branch.schema").Branch>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<import("./entities/branch.schema").Branch>;
    remove(id: string): Promise<import("./entities/branch.schema").Branch>;
}
