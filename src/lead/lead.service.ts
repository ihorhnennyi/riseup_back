import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Lead, LeadDocument } from './schemas/lead.schema';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>, // 🟢 Добавляем userModel
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    console.log('📦 Полученные данные для создания лида:', createLeadDto);

    if (createLeadDto.statusId) {
      createLeadDto.statusId = new Types.ObjectId(createLeadDto.statusId);
    }

    const newLead = new this.leadModel(createLeadDto);
    await newLead.save();

    console.log('✅ Лид успешно сохранен:', newLead);

    // Добавляем лид в массив рекрутера
    const updatedUser = await this.userModel.findByIdAndUpdate(
      createLeadDto.recruiterId, // Проверяем, есть ли ID рекрутера
      { $push: { leads: newLead._id } },
      { new: true },
    );

    console.log('🔄 Обновленный пользователь:', updatedUser);

    return newLead;
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

  async findLeadsByRecruiter(recruiterId: string): Promise<Lead[]> {
    if (!Types.ObjectId.isValid(recruiterId)) {
      throw new BadRequestException('Некорректный ID рекрутера');
    }

    return this.leadModel.find({ recruiterId }).populate('statusId').exec();
  }
}
