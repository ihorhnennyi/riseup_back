import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead, LeadDocument } from './schemas/lead.schema';

@Injectable()
export class LeadService {
  constructor(@InjectModel(Lead.name) private leadModel: Model<LeadDocument>) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    console.log('📦 Сохранение лида:', createLeadDto);

    // ✅ Приведение `statusId` к ObjectId
    if (createLeadDto.statusId) {
      createLeadDto.statusId = new Types.ObjectId(createLeadDto.statusId);
    }

    const newLead = new this.leadModel(createLeadDto);
    return newLead.save();
  }

  async findAll(): Promise<Lead[]> {
    return this.leadModel.find().populate('statusId').exec();
  }

  async findOne(id: string): Promise<Lead> {
    const lead = await this.leadModel.findById(id).populate('statusId').exec();
    if (!lead) throw new NotFoundException('Лид не найден');
    return lead;
  }

  async update(
    id: string,
    updateLeadDto: Partial<CreateLeadDto>,
  ): Promise<Lead> {
    if (updateLeadDto.statusId) {
      updateLeadDto.statusId = new Types.ObjectId(updateLeadDto.statusId);
    }

    const updatedLead = await this.leadModel
      .findByIdAndUpdate(id, updateLeadDto, { new: true })
      .exec();
    if (!updatedLead) throw new NotFoundException('Лид не найден');
    return updatedLead;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedLead = await this.leadModel.findByIdAndDelete(id).exec();
    if (!deletedLead) throw new NotFoundException('Лид не найден');
    return { message: 'Лид удалён' };
  }
}
