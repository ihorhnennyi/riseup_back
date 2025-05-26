import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.schema';

@Injectable()
export class CitiesService {
  constructor(
    @InjectModel(City.name)
    private cityModel: Model<City>,
  ) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    const city = new this.cityModel(createCityDto);
    return city.save();
  }

  async findAll(): Promise<City[]> {
    return this.cityModel.find({ isActive: true }).lean();
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cityModel.findById(id).lean();
    if (!city) throw new NotFoundException(`City with ID ${id} not found`);
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    return this.cityModel.findByIdAndUpdate(id, updateCityDto, { new: true }).lean();
  }

  async remove(id: string): Promise<City> {
    return this.cityModel.findByIdAndDelete(id).lean();
  }

  async findByIds(ids: string[]): Promise<City[]> {
    return this.cityModel.find({ _id: { $in: ids } }).lean();
  }

  async findByName(name: string): Promise<City[]> {
    return this.cityModel.find({ name: { $regex: name, $options: 'i' }, isActive: true }).lean();
  }
} 