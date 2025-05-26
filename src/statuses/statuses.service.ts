import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status } from './entities/status.schema';

@Injectable()
export class StatusesService {
  constructor(
    @InjectModel(Status.name)
    private statusModel: Model<Status>,
  ) {}

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    if (createStatusDto.isDefault) {
      await this.resetDefaultStatus();
    }
    const status = new this.statusModel(createStatusDto);
    return status.save();
  }

  async findAll(): Promise<Status[]> {
    return this.statusModel.find({ isActive: true }).sort({ order: 1 }).lean();
  }

  async findOne(id: string): Promise<Status> {
    const status = await this.statusModel.findById(id).lean();
    if (!status) throw new NotFoundException(`Status with ID ${id} not found`);
    return status;
  }

  async update(id: string, updateStatusDto: UpdateStatusDto): Promise<Status> {
    if (updateStatusDto.isDefault) {
      await this.resetDefaultStatus();
    }
    return this.statusModel.findByIdAndUpdate(id, updateStatusDto, { new: true }).lean();
  }

  async remove(id: string): Promise<Status> {
    const status = await this.findOne(id);
    if (status.isDefault) {
      throw new ConflictException('Cannot delete the default status');
    }
    return this.statusModel.findByIdAndDelete(id).lean();
  }

  async findByIds(ids: string[]): Promise<Status[]> {
    return this.statusModel.find({ _id: { $in: ids } }).lean();
  }

  async findByName(name: string): Promise<Status[]> {
    return this.statusModel.find({ name: { $regex: name, $options: 'i' }, isActive: true }).sort({ order: 1 }).lean();
  }

  async updateOrder(ids: string[]): Promise<Status[]> {
    const updates = ids.map((id, index) =>
      this.statusModel.findByIdAndUpdate(id, { order: index }, { new: true }).lean()
    );
    return Promise.all(updates);
  }

  async getDefaultStatus(): Promise<Status> {
    const defaultStatus = await this.statusModel.findOne({ isDefault: true, isActive: true }).lean();
    if (!defaultStatus) throw new NotFoundException('Default status not found');
    return defaultStatus;
  }

  private async resetDefaultStatus(): Promise<void> {
    await this.statusModel.updateMany({ isDefault: true }, { isDefault: false });
  }

  async getCallbackStatuses() {
    return this.statusModel.find({ type: 'callback' });
  }
} 