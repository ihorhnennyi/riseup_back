import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs/promises';
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
    if (
      !createLeadDto.recruiter ||
      !Types.ObjectId.isValid(createLeadDto.recruiter)
    ) {
      throw new BadRequestException('Некорректный recruiter');
    }

    // ✅ Преобразуем recruiter в ObjectId, если это строка
    createLeadDto.recruiter = new Types.ObjectId(createLeadDto.recruiter);

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

    // ✅ Генерируем ObjectId перед созданием лида
    const newLead = new this.leadModel({
      _id: new Types.ObjectId(), // ✅ Принудительно создаём ObjectId
      ...createLeadDto,
    });

    console.log('✅ Создаваемый лид:', newLead);

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
    console.log(`🔍 Преобразуем ID: ${id} -> ObjectId`);

    if (!Types.ObjectId.isValid(id)) {
      console.error(`❌ Некорректный формат ID: ${id}`);
      throw new BadRequestException('Неверный формат ID');
    }

    const objectId = new Types.ObjectId(id);
    const lead = await this.leadModel
      .findById(objectId)
      .populate('statusId')
      .exec();

    if (!lead) {
      console.error(`❌ Лид с ID ${id} не найден!`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`✅ Лид найден:`, lead);
    return lead;
  }

  async update(
    id: string,
    updateLeadDto: Partial<CreateLeadDto>,
  ): Promise<Lead> {
    console.log(`🔄 Обновление лида с ID: ${id}`);

    if (!Types.ObjectId.isValid(id)) {
      console.error(`❌ Ошибка: ID ${id} некорректен!`);
      throw new BadRequestException('Неверный формат ID');
    }

    const objectId = new Types.ObjectId(id);
    console.log(`📌 Преобразованный ID: ${objectId}`);

    const updatedLead = await this.leadModel
      .findByIdAndUpdate(objectId, updateLeadDto, { new: true })
      .exec();

    if (!updatedLead) {
      console.error(`❌ Лид с ID ${id} не найден!`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`✅ Лид обновлён:`, updatedLead);
    return updatedLead;
  }

  async remove(id: string): Promise<{ message: string }> {
    console.log(`🗑 Запрос на удаление лида с ID: ${id}`);

    // ✅ Проверяем валидность ObjectId
    if (!Types.ObjectId.isValid(id)) {
      console.error(`❌ Ошибка: Неверный формат ID ${id}`);
      throw new BadRequestException('Неверный формат ID');
    }

    const objectId = new Types.ObjectId(id);

    // ✅ Проверяем, существует ли лид
    const lead = await this.leadModel.findById(objectId).exec();
    if (!lead) {
      console.error(`❌ Ошибка: Лид с ID ${id} не найден!`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`✅ Лид найден:`, lead);

    // ✅ Удаляем фото, если оно есть
    if (lead.photo) {
      const filePath = `.${lead.photo}`; // Пути хранятся как `/uploads/leads/...`
      try {
        await fs.unlink(filePath);
        console.log(`🗑 Файл удалён: ${filePath}`);
      } catch (err) {
        console.warn(`⚠️ Файл не найден или уже удалён: ${filePath}`);
      }
    }

    // ✅ Удаляем лид из массива `leads` у рекрутера
    if (lead.recruiter) {
      const recruiterUpdate = await this.userModel.findByIdAndUpdate(
        lead.recruiter,
        { $pull: { leads: lead._id } }, // Удаляем lead._id из массива leads у пользователя
        { new: true },
      );
      if (recruiterUpdate) {
        console.log(
          `✅ Лид ${lead._id} удалён из списка рекрутера ${lead.recruiter}`,
        );
      } else {
        console.warn(`⚠️ Рекрутер ${lead.recruiter} не найден или не обновлён`);
      }
    }

    // ✅ Удаляем саму запись из базы данных
    const deleteResult = await this.leadModel
      .deleteOne({ _id: objectId })
      .exec();
    if (deleteResult.deletedCount === 0) {
      console.error(`❌ Ошибка при удалении лида с ID: ${id}`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`🗑 Лид ${id} успешно удалён`);

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
