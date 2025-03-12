import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { User, UserDocument } from '../auth/schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  [x: string]: any;
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    console.log('Полученные данные:', createUserDto);

    if (!createUserDto.branch) {
      throw new BadRequestException('Поле "branch" обязательно');
    }

    const birthDate = createUserDto.birthDate
      ? new Date(createUserDto.birthDate)
      : null;

    if (birthDate && isNaN(birthDate.getTime())) {
      throw new BadRequestException('Некорректный формат даты');
    }

    let integrations = createUserDto.integrations;
    if (typeof integrations === 'string') {
      try {
        integrations = JSON.parse(integrations);
        if (!Array.isArray(integrations)) {
          throw new Error();
        }
      } catch (error) {
        throw new BadRequestException('Некорректный формат интеграций');
      }
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
      birthDate,
      integrations,
    });

    return newUser.save();
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    if (
      updateUserDto.birthDate &&
      typeof updateUserDto.birthDate === 'string'
    ) {
      const parsedDate = new Date(updateUserDto.birthDate);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Некорректный формат даты');
      }
      updateUserDto.birthDate = parsedDate;
    }

    const user = await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();

    if (!user) throw new NotFoundException('Пользователь не найден');

    return user;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) throw new NotFoundException('Пользователь не найден');
    return { message: 'Пользователь удален' };
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('cities branches leads').exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('cities branches leads')
      .exec();
    if (!user) throw new NotFoundException('Пользователь не найден');
    return user;
  }

  async getRecruiterLeads(recruiterId: string) {
    const recruiter = await this.userModel
      .findById(recruiterId)
      .populate('leads');
    if (!recruiter) throw new NotFoundException('Рекрутер не найден');

    return recruiter.leads; // ✅ Возвращаем список лидов
  }
}
