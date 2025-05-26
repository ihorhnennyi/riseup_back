import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './schemas/city.schema';
export declare class CitiesController {
    private readonly citiesService;
    constructor(citiesService: CitiesService);
    create(createCityDto: CreateCityDto): Promise<City>;
    findAll(): Promise<City[]>;
    searchByName(name: string): Promise<City[]>;
    findOne(id: string): Promise<City>;
    update(id: string, updateCityDto: UpdateCityDto): Promise<City>;
    remove(id: string): Promise<City>;
}
