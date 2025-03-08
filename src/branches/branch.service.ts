import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { Branch, BranchDocument } from './schemas/branch.schema';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const { name, cityId } = createBranchDto;

    const branch = new this.branchModel({
      name,
      city: cityId,
    });

    return branch.save();
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().populate('city').exec();
  }

  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchModel.findById(id).populate('city').exec();
    if (!branch) {
      throw new NotFoundException('Филиал не найден');
    }
    return branch;
  }

  async update(id: string, updateBranchDto: UpdateBranchDto): Promise<Branch> {
    const updatedBranch = await this.branchModel
      .findByIdAndUpdate(id, updateBranchDto, { new: true })
      .populate('city')
      .exec();
    if (!updatedBranch) {
      throw new NotFoundException('Филиал не найден');
    }
    return updatedBranch;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedBranch = await this.branchModel.findByIdAndDelete(id).exec();
    if (!deletedBranch) {
      throw new NotFoundException('Филиал не найден');
    }
    return { message: 'Филиал успешно удален' };
  }
}
