import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema as MongooseSchema } from 'mongoose';
import { Branch, BranchDocument } from '../branches/schemas/branch.schema';
import { Candidate } from '../candidates/entities/candidate.schema';
import { City, CityDocument } from '../cities/schemas/city.schema';
import { UserRole } from '../common/enums/role.enum';
import { Source } from '../sources/schemas/source.schema';
import { Status, StatusDocument } from '../statuses/schemas/status.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class TestService {
  private readonly logger = new Logger(TestService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Candidate.name) private candidateModel: Model<Candidate>,
    @InjectModel(City.name) private cityModel: Model<CityDocument>,
    @InjectModel(Status.name) private statusModel: Model<StatusDocument>,
    @InjectModel(Source.name) private sourceModel: Model<Source>,
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async seedTestData() {
    try {
      // Очищаем существующие данные
      await this.clearAllData();

      // Создаем тестовые города
      const cities = await this.createTestCities();
      this.logger.log(`Created ${cities.length} test cities`);

      // Создаем тестовую филию
      const branch = await this.createTestBranch(cities[0]);
      this.logger.log('Created test branch');

      // Создаем тестовые статусы
      const statuses = await this.createTestStatuses();
      this.logger.log(`Created ${statuses.length} test statuses`);

      // Создаем тестовые источники
      const sources = await this.createTestSources();
      this.logger.log(`Created ${sources.length} test sources`);

      // Создаем тестовых пользователей
      const users = await this.createTestUsers(cities[0], branch);
      this.logger.log(`Created ${users.length} test users`);

      // Создаем тестовых кандидатов
      const candidates = await this.createTestCandidates(users, cities, statuses, sources);
      this.logger.log(`Created ${candidates.length} test candidates`);

      return {
        message: 'Test data seeded successfully',
        counts: {
          cities: cities.length,
          branch: 1,
          statuses: statuses.length,
          sources: sources.length,
          users: users.length,
          candidates: candidates.length,
        },
      };
    } catch (error) {
      this.logger.error('Error seeding test data:', error);
      throw error;
    }
  }

  private async clearAllData() {
    await Promise.all([
      this.userModel.deleteMany({}),
      this.candidateModel.deleteMany({}),
      this.cityModel.deleteMany({}),
      this.statusModel.deleteMany({}),
      this.sourceModel.deleteMany({}),
      this.branchModel.deleteMany({}),
    ]);
  }

  private async createTestCities() {
    const cities = [
      { name: 'Київ', isActive: true },
      { name: 'Львів', isActive: true },
      { name: 'Харків', isActive: true },
      { name: 'Одеса', isActive: true },
      { name: 'Дніпро', isActive: true },
    ];
    return this.cityModel.insertMany(cities);
  }

  private async createTestBranch(city: CityDocument) {
    const branch = {
      name: 'Головний офіс',
      description: 'Головний офіс компанії',
      city: new MongooseSchema.Types.ObjectId(city._id.toString()),
      isActive: true,
    };
    return this.branchModel.create(branch);
  }

  private async createTestStatuses() {
    const statuses = [
      { name: 'Новий', color: '#3498db', isActive: true },
      { name: 'На співбесіді', color: '#f1c40f', isActive: true },
      { name: 'Відхилено', color: '#e74c3c', isActive: true },
      { name: 'Прийнято', color: '#2ecc71', isActive: true },
      { name: 'Розглядається', color: '#9b59b6', isActive: true },
    ];
    return this.statusModel.insertMany(statuses);
  }

  private async createTestSources() {
    const sources = [
      { name: 'LinkedIn', isActive: true },
      { name: 'Djinni', isActive: true },
      { name: 'Work.ua', isActive: true },
      { name: 'Rabota.ua', isActive: true },
      { name: 'Рекомендація', isActive: true },
    ];
    return this.sourceModel.insertMany(sources);
  }

  private async createTestUsers(city: CityDocument, branch: BranchDocument) {
    const users = [
      {
        firstName: 'Адмін',
        lastName: 'Адмінів',
        email: 'admin@example.com',
        password: '$2b$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', // password: admin123
        role: UserRole.ADMIN,
        isActive: true,
        city: new MongooseSchema.Types.ObjectId(city._id.toString()),
        branch: new MongooseSchema.Types.ObjectId(branch._id.toString()),
      },
      {
        firstName: 'Рекрутер',
        lastName: 'Рекрутерів',
        email: 'recruiter@example.com',
        password: '$2b$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX', // password: recruiter123
        role: UserRole.RECRUITER,
        isActive: true,
        city: new MongooseSchema.Types.ObjectId(city._id.toString()),
        branch: new MongooseSchema.Types.ObjectId(branch._id.toString()),
      },
    ];
    return this.userModel.insertMany(users);
  }

  private async createTestCandidates(users: UserDocument[], cities: CityDocument[], statuses: StatusDocument[], sources: Source[]) {
    const candidates = [];
    const positions = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'QA Engineer'];
    const employmentTypes = ['Повна зайнятість', 'Часткова зайнятість', 'Проектна робота'];
    const genders = ['Чоловік', 'Жінка'];

    for (let i = 0; i < 20; i++) {
      const candidate = {
        firstName: `Кандидат${i + 1}`,
        lastName: `Кандидатів${i + 1}`,
        middleName: `Кандидатович${i + 1}`,
        email: `candidate${i + 1}@example.com`,
        phone: `+38050${String(i + 1).padStart(7, '0')}`,
        age: Math.floor(Math.random() * 30) + 20,
        position: positions[Math.floor(Math.random() * positions.length)],
        salary: Math.floor(Math.random() * 5000) + 1000,
        city: new MongooseSchema.Types.ObjectId(cities[Math.floor(Math.random() * cities.length)]._id.toString()),
        source: new MongooseSchema.Types.ObjectId(sources[Math.floor(Math.random() * sources.length)]._id.toString()),
        description: `Опис кандидата ${i + 1}`,
        createdBy: new MongooseSchema.Types.ObjectId(users[Math.floor(Math.random() * users.length)]._id.toString()),
        status: new MongooseSchema.Types.ObjectId(statuses[Math.floor(Math.random() * statuses.length)]._id.toString()),
        employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
        gender: genders[Math.floor(Math.random() * genders.length)],
        isActive: true,
      };
      candidates.push(candidate);
    }

    return this.candidateModel.insertMany(candidates);
  }
} 