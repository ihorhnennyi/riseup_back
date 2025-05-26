import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.schema';
export declare class BranchesService {
    private branchModel;
    constructor(branchModel: Model<Branch>);
    create(createBranchDto: CreateBranchDto): Promise<Branch>;
    findAll(): Promise<Branch[]>;
    findOne(id: string): Promise<Branch>;
    update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch>;
    remove(id: string): Promise<Branch>;
    findByIds(ids: string[]): Promise<Branch[]>;
    findByName(name: string): Promise<Branch[]>;
}
