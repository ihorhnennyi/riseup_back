import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model, Types } from 'mongoose';
import { UserRole } from 'src/enum/user-role.enum';
import { Lead, LeadDocument } from 'src/lead/schemas/lead.schema';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Lead.name) private leadModel: Model<LeadDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('📌 Данные для создания пользователя:', createUserDto);

    // ✅ Удаляем _id, если он передан (MongoDB сам его создаст)
    if (createUserDto._id) {
      delete createUserDto._id;
    }

    // ✅ Проверяем branch (если оно обязательно)
    if (!createUserDto.branch) {
      throw new BadRequestException('Поле "branch" обязательно');
    }

    // ✅ Проверяем дату рождения
    if (createUserDto.birthDate) {
      const birthDate = new Date(createUserDto.birthDate);
      if (isNaN(birthDate.getTime())) {
        throw new BadRequestException('Некорректный формат даты');
      }
      createUserDto.birthDate = birthDate;
    }

    // ✅ Проверяем и устанавливаем роль
    if (!createUserDto.role) {
      createUserDto.role = UserRole.RECRUITER;
    }

    // ✅ Преобразуем leads в ObjectId[]
    if (Array.isArray(createUserDto.leads)) {
      createUserDto.leads = createUserDto.leads.map(
        (leadId) => new Types.ObjectId(leadId),
      );
    }

    // ✅ Парсим интеграции
    if (typeof createUserDto.integrations === 'string') {
      try {
        createUserDto.integrations = JSON.parse(createUserDto.integrations);
        if (!Array.isArray(createUserDto.integrations)) {
          throw new Error();
        }
      } catch {
        throw new BadRequestException('Некорректный формат интеграций');
      }
    }

    // ✅ Хешируем пароль
    createUserDto.password = await bcrypt.hash(createUserDto.password, 10);

    // ✅ Генерируем _id вручную (ВАЖНО!)
    const newUser = new this.userModel({
      _id: new Types.ObjectId(), // 💡 MongoDB теперь точно получит _id
      ...createUserDto,
    });

    console.log('✅ Успешно создан рекрутер:', newUser);

    return newUser.save();
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('❌ Некорректный ID пользователя');
    }

    const objectId = new Types.ObjectId(id);
    console.log('🔄 Преобразованный ObjectId:', objectId);

    const existingUser = await this.userModel.findById(objectId);
    if (!existingUser) {
      console.log('❌ Пользователь не найден в базе перед обновлением');
      throw new NotFoundException('❌ Пользователь не найден');
    }

    console.log('✅ Найденный пользователь перед обновлением:', existingUser);
    console.log('📥 Данные для обновления:', updateUserDto);

    // 🛠 Добавляем `lean(false)` и `exec()`
    const user = await this.userModel
      .findByIdAndUpdate(objectId, updateUserDto, { new: true })
      .populate('leads')
      .lean(false) // 🔥 ВАЖНО: убираем lean() перед exec()!
      .exec();

    if (!user) {
      console.log('❌ Ошибка: Пользователь не найден после обновления');
      throw new NotFoundException('❌ Пользователь не найден после обновления');
    }

    console.log('✅ Пользователь успешно обновлен:', user);
    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('Пользователь не найден');
    return { message: 'Пользователь удален' };
  }

  async findOne(id: string): Promise<User> {
    console.log(`🔍 Поиск пользователя с ID: ${id}`); // Добавлен лог
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Некорректный ID пользователя');
    }

    const user = await this.userModel.findById(new Types.ObjectId(id));
    if (!user) throw new NotFoundException(`Пользователь с ID ${id} не найден`);

    return user;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('leads').exec();
  }

  async getUserLeads(userId: string): Promise<Lead[]> {
    console.log(`🔍 Проверка пользователя с ID: ${userId}`);

    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Некорректный ID пользователя');
    }

    // 🔥 Используем aggregate() и $lookup
    const userWithLeads = await this.userModel
      .aggregate([
        { $match: { _id: new Types.ObjectId(userId) } }, // Находим пользователя по ID
        {
          $lookup: {
            from: 'leads', // 💡 Имя коллекции MongoDB
            localField: 'leads', // Поле в User
            foreignField: '_id', // Поле в Lead
            as: 'leads', // Как назвать полученные данные
          },
        },
      ])
      .exec();

    if (!userWithLeads.length) {
      throw new NotFoundException(`Пользователь ${userId} не найден`);
    }

    console.log(`✅ Лиды через aggregate():`, userWithLeads[0].leads);
    return userWithLeads[0].leads;
  }
}
