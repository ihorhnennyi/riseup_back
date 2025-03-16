import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/auth/schemas/user.schema';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { Lead, LeadDocument } from './schemas/lead.schema';

@Injectable()
export class LeadService {
  constructor(
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  /**
   * 📌 Создание нового лида
   */
  async create(createLeadDto: CreateLeadDto): Promise<Lead> {
    console.log('📦 Создание лида:', createLeadDto);

    // Проверяем recruiterId (рекрутер, который создаёт лида)
    if (
      !createLeadDto.recruiter ||
      !Types.ObjectId.isValid(createLeadDto.recruiter)
    ) {
      throw new BadRequestException('Некорректный recruiter');
    }

    // Проверяем statusId, если передан
    if (createLeadDto.statusId) {
      if (!Types.ObjectId.isValid(String(createLeadDto.statusId))) {
        throw new BadRequestException('Некорректный statusId');
      }
      (createLeadDto as any).statusId = new Types.ObjectId(
        createLeadDto.statusId,
      );
    }

    // Преобразуем recruiter в ObjectId
    const recruiterId = new Types.ObjectId(createLeadDto.recruiter);

    // Создаём нового лида
    const newLead = new this.leadModel({
      _id: new Types.ObjectId(), // Генерируем новый ObjectId
      ...createLeadDto,
      recruiter: recruiterId,
    });

    const existingLead = await this.leadModel
      .findOne({ phone: createLeadDto.phone })
      .exec();
    if (existingLead) {
      throw new BadRequestException(
        `Лид с таким телефоном уже существует: ${createLeadDto.phone}`,
      );
    }

    // Сохраняем лида в БД
    await newLead.save();
    console.log('✅ Лид успешно создан:', newLead);

    console.log(
      '🔍 Проверяем существование поля leads у рекрутера:',
      createLeadDto.recruiter,
    );

    // Проверяем, есть ли уже поле `leads` у рекрутера
    const recruiter = await this.userModel.findById(recruiterId).exec();

    if (!recruiter) {
      throw new NotFoundException('Рекрутер не найден');
    }

    if (!Array.isArray(recruiter.leads)) {
      console.log('⚠️ Поле leads отсутствует, создаем его...');
      await this.userModel.updateOne(
        { _id: recruiterId },
        { $set: { leads: [] } },
      );
    }

    console.log('📌 Добавляем лид в массив рекрутера:', newLead._id);

    // Добавляем лида в массив рекрутера (избегая дубликатов)
    const result = await this.userModel
      .findByIdAndUpdate(
        recruiterId,
        { $addToSet: { leads: newLead._id } },
        { new: true },
      )
      .populate('leads')
      .exec();

    console.log('✅ Рекрутер после обновления:', result);

    return newLead;
  }

  /**
   * 📌 Получение всех лидов
   */
  async findAll(): Promise<Lead[]> {
    console.log('🔍 Запрос на получение всех лидов');
    return this.leadModel.find().populate('statusId').exec();
  }

  /**
   * 📌 Получение лида по ID
   */
  async findOne(id: string): Promise<Lead> {
    console.log(`🔍 Ищем лида в базе данных по ID: ${id}`);

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный формат ID');
    }

    const objectId = new Types.ObjectId(id);

    const lead = await this.leadModel
      .findById(objectId)
      .populate('statusId')
      .populate('recruiter', 'firstName lastName email') // ✅ Загружаем рекрутёра
      .exec();

    console.log(`🔍 Результат поиска:`, lead);

    if (!lead) {
      throw new NotFoundException('Лид не найден');
    }
    return lead;
  }

  /**
   * 📌 Обновление лида
   */
  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    console.log(`🔄 Обновление лида с ID: ${id}`, updateLeadDto);

    // Проверяем корректность ID
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный формат ID');
    }

    const objectId = new Types.ObjectId(id);

    // Создаём новый объект без _id
    const updateData = { ...updateLeadDto };
    delete (updateData as any)._id; // Удаляем _id, если он вдруг передан

    // Преобразуем statusId, если передан
    if (updateData.statusId) {
      if (!Types.ObjectId.isValid(updateData.statusId)) {
        throw new BadRequestException('Некорректный statusId');
      }
      updateData.statusId = new Types.ObjectId(updateData.statusId) as any; // ✅ Добавили `as any`
    }

    // Преобразуем recruiter, если передан
    if (updateData.recruiter) {
      if (!Types.ObjectId.isValid(updateData.recruiter)) {
        throw new BadRequestException('Некорректный recruiter');
      }
      updateData.recruiter = new Types.ObjectId(updateData.recruiter) as any; // ✅ Добавили `as any`
    }

    // Выполняем обновление
    const updatedLead = await this.leadModel
      .findByIdAndUpdate(objectId, { $set: updateData }, { new: true })
      .populate('recruiter') // ✅ Теперь должен подтягиваться рекрутер
      .exec();

    if (!updatedLead) {
      console.error(`❌ Ошибка: Лид с ID ${id} не найден`);
      throw new NotFoundException('Лид не найден');
    }

    console.log('✅ Лид успешно обновлён:', updatedLead);
    return updatedLead;
  }

  /**
   * 📌 Удаление лида
   */
  async remove(id: string): Promise<{ message: string }> {
    console.log(`🗑 Запрос на удаление лида с ID: ${id}`);

    // Проверяем корректность ID
    if (!Types.ObjectId.isValid(id)) {
      console.error(`❌ Ошибка: Неверный формат ID - ${id}`);
      throw new BadRequestException('Неверный формат ID');
    }

    const objectId = new Types.ObjectId(id);

    // 🔍 Находим лида перед удалением, чтобы узнать его рекрутера
    const lead = await this.leadModel.findById(objectId);
    if (!lead) {
      console.error(`❌ Ошибка: Лид с ID ${id} не найден`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`🔍 Найден кандидат:`, lead);

    // 🗑 Удаляем лида
    const deleteResult = await this.leadModel
      .deleteOne({ _id: objectId })
      .exec();
    if (deleteResult.deletedCount === 0) {
      console.error(`❌ Ошибка: Лид с ID ${id} не найден`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`✅ Лид с ID ${id} успешно удалён`);

    // 🔄 Обновляем рекрутера (удаляем лид из массива leads)
    console.log(
      `🔄 Удаляем ID ${id} из массива leads рекрутера ${lead.recruiter}`,
    );

    await this.userModel.findByIdAndUpdate(
      lead.recruiter,
      { $pull: { leads: objectId } }, // ❌ Удаляем ID лида из массива leads
      { new: true },
    );

    console.log(`✅ Лид удалён из массива рекрутера`);

    return { message: 'Лид удалён' };
  }
}
