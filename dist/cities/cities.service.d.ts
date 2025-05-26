import { Model } from 'mongoose';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.schema';
export declare class CitiesService {
    private cityModel;
    constructor(cityModel: Model<City>);
    create(createCityDto: CreateCityDto): Promise<City>;
    findAll(): Promise<City[]>;
    findOne(id: string): Promise<City>;
    update(id: string, updateCityDto: UpdateCityDto): Promise<City>;
    remove(id: string): Promise<City>;
    findByIds(ids: string[]): Promise<City[]>;
    findByName(name: string): Promise<City[]>;
}
