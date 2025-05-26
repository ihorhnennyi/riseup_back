import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch } from './entities/branch.schema';

@Injectable()
export class BranchesService {
  constructor(
    @InjectModel(Branch.name)
    private branchModel: Model<Branch>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const branch = new this.branchModel(createBranchDto);
    return branch.save();
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find({ isActive: true }).populate('city', 'name').lean();
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchModel.findById(id).populate('city', 'name').lean();
    if (!branch) throw new NotFoundException(`Branch with ID ${id} not found`);
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    return this.branchModel.findByIdAndUpdate(id, updateBranchDto, { new: true }).populate('city', 'name').lean();
  }

  async remove(id: string): Promise<Branch> {
    return this.branchModel.findByIdAndDelete(id).populate('city', 'name').lean();
  }

  async findByIds(ids: string[]): Promise<Branch[]> {
    return this.branchModel.find({ _id: { $in: ids } }).populate('city', 'name').lean();
  }

  async findByName(name: string): Promise<Branch[]> {
    return this.branchModel.find({ name: { $regex: name, $options: 'i' }, isActive: true }).populate('city', 'name').lean();
  }
} 