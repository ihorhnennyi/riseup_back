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
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    console.log('📦 Полученные данные для создания лида:', createLeadDto);

    // ✅ Проверяем recruiterId
    // Проверяем recruiterId
    // Проверяем recruiter
    if (
      !createLeadDto.recruiter ||
      !Types.ObjectId.isValid(createLeadDto.recruiter)
    ) {
      throw new BadRequestException('Некорректный recruiter');
    }

    // ✅ Теперь просто приводим к ObjectId, если это строка
    if (typeof createLeadDto.recruiter === 'string') {
      createLeadDto.recruiter = new Types.ObjectId(createLeadDto.recruiter);
    }

    // ✅ Проверяем, существует ли рекрутер перед сохранением лида
    const recruiter = await this.userModel.findById(createLeadDto.recruiter);
    if (!recruiter) {
      console.error(
        `❌ Ошибка: Рекрутер с ID ${createLeadDto.recruiter} не найден`,
      );
      throw new NotFoundException(
        `Рекрутер с ID ${createLeadDto.recruiter} не найден`,
      );
    }

    // ✅ Проверяем statusId, если передан
    if (createLeadDto.statusId) {
      if (!Types.ObjectId.isValid(createLeadDto.statusId)) {
        throw new BadRequestException('Некорректный statusId');
      }
      createLeadDto.statusId = new Types.ObjectId(createLeadDto.statusId);
    }

    console.log('📌 recruitId перед сохранением:', createLeadDto.recruiter);

    // ✅ Создание нового лида
    const newLead = new this.leadModel(createLeadDto);
    await newLead.save();
    console.log('✅ Лид успешно сохранен:', newLead);

    console.log(
      `📌 Добавление лида ${newLead._id} пользователю ${createLeadDto.recruiter}`,
    );

    // ✅ Добавляем лида в массив leads рекрутера (используем $addToSet, чтобы избежать дубликатов)
    await this.userModel.findByIdAndUpdate(
      createLeadDto.recruiter,
      { $addToSet: { leads: newLead._id } }, // ✅ Добавляем лида в массив leads у рекрутера
      { new: true },
    );

    console.log(
      `✅ Лид ${newLead._id} добавлен пользователю ${createLeadDto.recruiter}`,
    );

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
    console.log(`🔍 Проверка рекрутера с ID: ${recruiterId}`);

    if (!Types.ObjectId.isValid(recruiterId)) {
      throw new BadRequestException('Некорректный ID рекрутера');
    }

    // Ищем лидов по recruiter (он же User)
    const leads = await this.leadModel
      .find({ recruiter: recruiterId }) // 🎯 ищем по recruiter
      .populate('statusId') // ✅ Подгружаем статус
      .populate('recruiter', 'firstName lastName email') // ✅ Подгружаем данные о рекрутере
      .exec();

    if (!leads || leads.length === 0) {
      console.warn(`⚠️ У рекрутера ${recruiterId} нет лидов.`);
      return [];
    }

    console.log(`✅ Найденные лиды:`, leads);

    return leads;
  }
}
