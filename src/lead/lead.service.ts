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

  async findAll(
    currentUser: UserDocument,
  ): Promise<Pick<Lead, '_id' | 'recruiter'>[]> {
    console.log(`🔍 Запрос на получение всех лидов от ${currentUser.role}`);

    // **✅ Проверяем, есть ли у пользователя `id`**
    if (!currentUser.id) {
      console.error('❌ Ошибка: currentUser.id отсутствует!');
      return [];
    }

    const currentUserId = new Types.ObjectId(currentUser.id); // ✅ Приводим к

    // **1️⃣ Фильтруем лидов по роли**
    const allLeads = await this.leadModel.find().select('_id recruiter').exec();

    console.log('🔍 allLeads:', allLeads);

    // **2️⃣ Фильтрация по рекрутеру**
    const filteredLeads =
      currentUser.role === 'recruiter'
        ? allLeads.filter((lead) => {
            if (!lead.recruiter) return false;
            const leadRecruiterId = lead.recruiter.toString();
            console.log(
              '🔎 Сравниваем recruiter:',
              leadRecruiterId,
              'с',
              currentUserId.toString(),
            );
            return leadRecruiterId === currentUserId.toString();
          })
        : allLeads;

    console.log('✅ Отфильтрованные лиды:', filteredLeads);

    // **3️⃣ Получаем список уникальных recruiterId**
    const recruiterIds = filteredLeads.map((lead) => lead.recruiter.toString());
    console.log('🔍 recruiterIds для запроса:', recruiterIds);

    console.log('🔍 recruiterIds:', recruiterIds);

    // **4️⃣ Запрашиваем рекрутеров**
    const recruiterIdsAsObjectId = recruiterIds.map(
      (id) => new Types.ObjectId(id),
    );

    const recruiters = await this.userModel
      .find({ _id: { $in: recruiterIdsAsObjectId } }) // 👈 Теперь Mongo должно находить ID
      .select('_id')
      .exec();

    console.log('✅ recruiters после запроса:', recruiters);

    // **5️⃣ Создаём `Map` для быстрого доступа**
    const recruiterMap = new Map(
      recruiters.map((recruiter) => [recruiter._id.toString(), recruiter._id]),
    );

    console.log('📌 recruiterMap:', recruiterMap);

    // **6️⃣ Формируем результат**
    return filteredLeads.map((lead) => ({
      _id: new Types.ObjectId(lead._id),
      recruiter: recruiterMap.get(lead.recruiter.toString()) ?? null, // ✅ Гарантия, что ID есть
    })) as Pick<Lead, '_id' | 'recruiter'>[];
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

  async update(id: string, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    console.log(`🔄 Обновление лида с ID: ${id}`, updateLeadDto);

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный формат ID');
    }

    const objectId = new Types.ObjectId(id);
    const existingLead = await this.leadModel.findById(objectId);

    if (!existingLead) {
      throw new NotFoundException('Лид не найден');
    }

    const oldRecruiterId = existingLead.recruiter
      ? new Types.ObjectId(existingLead.recruiter)
      : null;
    const newRecruiterId = new Types.ObjectId(updateLeadDto.recruiter);

    console.log(`📌 Старый рекрутер:`, oldRecruiterId?.toString());
    console.log(`📌 Новый рекрутер:`, newRecruiterId.toString());

    // Проверяем существование нового рекрутера
    const newRecruiter = await this.userModel.findById(newRecruiterId);
    if (!newRecruiter) {
      throw new NotFoundException('Новый рекрутер не найден');
    }

    // 1️⃣ **Удаляем лида у старого рекрутера, если он меняется**
    if (oldRecruiterId && !oldRecruiterId.equals(newRecruiterId)) {
      console.log(
        `🗑 Удаляем лида ${id} из старого рекрутера ${oldRecruiterId}`,
      );

      await this.userModel.updateOne(
        { _id: oldRecruiterId },
        { $pull: { leads: objectId } },
      );

      // Проверяем, остались ли лиды у старого рекрутера
      const oldRecruiter = await this.userModel.findById(oldRecruiterId);
      if (!oldRecruiter?.leads || oldRecruiter.leads.length === 0) {
        console.log(`⚠️ leads у старого рекрутера пуст, создаём массив.`);
        await this.userModel.updateOne(
          { _id: oldRecruiterId },
          { $set: { leads: [] } },
        );
      }
    }

    // 2️⃣ **Обновляем рекрутера у лида вручную**
    console.log(`✏️ Меняем рекрутера у лида...`);
    existingLead.recruiter = newRecruiterId;
    await existingLead.save();

    console.log(`✅ Лид обновлён:`, existingLead);

    // 3️⃣ **Добавляем лида в массив нового рекрутера**
    console.log(`➕ Добавляем лида ${id} в нового рекрутера ${newRecruiterId}`);

    await this.userModel.updateOne(
      { _id: newRecruiterId },
      { $addToSet: { leads: existingLead._id } },
    );

    return existingLead;
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

    // 🔍 Находим лида перед удалением
    const lead = await this.leadModel.findById(objectId);
    if (!lead) {
      console.error(`❌ Ошибка: Лид с ID ${id} не найден`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`🔍 Найден кандидат:`, lead);

    // 🔄 Удаляем лид из массива leads у рекрутера перед удалением самого лида
    if (lead.recruiter) {
      console.log(
        `🔄 Удаляем ID ${id} из массива leads рекрутера ${lead.recruiter}`,
      );

      await this.userModel
        .findByIdAndUpdate(
          lead.recruiter,
          { $pull: { leads: objectId } },
          { new: true },
        )
        .exec();
    }

    // 🗑 Удаляем лида
    const deleteResult = await this.leadModel
      .deleteOne({ _id: objectId })
      .exec();
    if (deleteResult.deletedCount === 0) {
      console.error(`❌ Ошибка: Лид с ID ${id} не найден`);
      throw new NotFoundException('Лид не найден');
    }

    console.log(`✅ Лид с ID ${id} успешно удалён из базы данных`);

    return { message: 'Лид удалён' };
  }
}
