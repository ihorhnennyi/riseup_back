import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City, CityDocument } from './schemas/city.schema';

@Injectable()
export class CityService {
  constructor(@InjectModel(City.name) private cityModel: Model<CityDocument>) {}

  async create(createCityDto: CreateCityDto): Promise<City> {
    return this.cityModel.create(createCityDto);
  }

  async findAll(): Promise<City[]> {
    return this.cityModel.find().exec();
  }

  async findOne(id: string): Promise<City> {
    const city = await this.cityModel.findById(id).exec();
    if (!city) {
      throw new NotFoundException('Город не найден');
    }
    return city;
  }

  async update(id: string, updateCityDto: UpdateCityDto): Promise<City> {
    const updatedCity = await this.cityModel
      .findByIdAndUpdate(id, updateCityDto, { new: true })
      .exec();
    if (!updatedCity) {
      throw new NotFoundException('Город не найден');
    }
    return updatedCity;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedCity = await this.cityModel.findByIdAndDelete(id).exec();
    if (!deletedCity) {
      throw new NotFoundException('Город не найден');
    }
    return { message: 'Город успешно удален' };
  }
}
