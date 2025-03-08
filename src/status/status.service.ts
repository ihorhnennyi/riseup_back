import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { Status, StatusDocument } from './schemas/status.schema';

@Injectable()
export class StatusService {
  constructor(
    @InjectModel(Status.name) private statusModel: Model<StatusDocument>,
  ) {}

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    return this.statusModel.create(createStatusDto);
  }

  async findAll(): Promise<Status[]> {
    return this.statusModel.find().exec();
  }

  async findOne(id: string): Promise<Status> {
    const status = await this.statusModel.findById(id).exec();
    if (!status) {
      throw new NotFoundException('Статус не найден');
    }
    return status;
  }

  async update(id: string, updateStatusDto: UpdateStatusDto): Promise<Status> {
    const updatedStatus = await this.statusModel
      .findByIdAndUpdate(id, updateStatusDto, { new: true })
      .exec();
    if (!updatedStatus) {
      throw new NotFoundException('Статус не найден');
    }
    return updatedStatus;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedStatus = await this.statusModel.findByIdAndDelete(id).exec();
    if (!deletedStatus) {
      throw new NotFoundException('Статус не найден');
    }
    return { message: 'Статус успешно удален' };
  }
}
