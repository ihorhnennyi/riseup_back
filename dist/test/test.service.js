"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TestService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const branch_schema_1 = require("../branches/schemas/branch.schema");
const candidate_schema_1 = require("../candidates/entities/candidate.schema");
const city_schema_1 = require("../cities/schemas/city.schema");
const role_enum_1 = require("../common/enums/role.enum");
const source_schema_1 = require("../sources/schemas/source.schema");
const status_schema_1 = require("../statuses/schemas/status.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let TestService = TestService_1 = class TestService {
    constructor(userModel, candidateModel, cityModel, statusModel, sourceModel, branchModel) {
        this.userModel = userModel;
        this.candidateModel = candidateModel;
        this.cityModel = cityModel;
        this.statusModel = statusModel;
        this.sourceModel = sourceModel;
        this.branchModel = branchModel;
        this.logger = new common_1.Logger(TestService_1.name);
    }
    async seedTestData() {
        try {
            await this.clearAllData();
            const cities = await this.createTestCities();
            this.logger.log(`Created ${cities.length} test cities`);
            const branch = await this.createTestBranch(cities[0]);
            this.logger.log('Created test branch');
            const statuses = await this.createTestStatuses();
            this.logger.log(`Created ${statuses.length} test statuses`);
            const sources = await this.createTestSources();
            this.logger.log(`Created ${sources.length} test sources`);
            const users = await this.createTestUsers(cities[0], branch);
            this.logger.log(`Created ${users.length} test users`);
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
        }
        catch (error) {
            this.logger.error('Error seeding test data:', error);
            throw error;
        }
    }
    async clearAllData() {
        await Promise.all([
            this.userModel.deleteMany({}),
            this.candidateModel.deleteMany({}),
            this.cityModel.deleteMany({}),
            this.statusModel.deleteMany({}),
            this.sourceModel.deleteMany({}),
            this.branchModel.deleteMany({}),
        ]);
    }
    async createTestCities() {
        const cities = [
            { name: 'Київ', isActive: true },
            { name: 'Львів', isActive: true },
            { name: 'Харків', isActive: true },
            { name: 'Одеса', isActive: true },
            { name: 'Дніпро', isActive: true },
        ];
        return this.cityModel.insertMany(cities);
    }
    async createTestBranch(city) {
        const branch = {
            name: 'Головний офіс',
            description: 'Головний офіс компанії',
            city: new mongoose_2.Schema.Types.ObjectId(city._id.toString()),
            isActive: true,
        };
        return this.branchModel.create(branch);
    }
    async createTestStatuses() {
        const statuses = [
            { name: 'Новий', color: '#3498db', isActive: true },
            { name: 'На співбесіді', color: '#f1c40f', isActive: true },
            { name: 'Відхилено', color: '#e74c3c', isActive: true },
            { name: 'Прийнято', color: '#2ecc71', isActive: true },
            { name: 'Розглядається', color: '#9b59b6', isActive: true },
        ];
        return this.statusModel.insertMany(statuses);
    }
    async createTestSources() {
        const sources = [
            { name: 'LinkedIn', isActive: true },
            { name: 'Djinni', isActive: true },
            { name: 'Work.ua', isActive: true },
            { name: 'Rabota.ua', isActive: true },
            { name: 'Рекомендація', isActive: true },
        ];
        return this.sourceModel.insertMany(sources);
    }
    async createTestUsers(city, branch) {
        const users = [
            {
                firstName: 'Адмін',
                lastName: 'Адмінів',
                email: 'admin@example.com',
                password: '$2b$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
                role: role_enum_1.UserRole.ADMIN,
                isActive: true,
                city: new mongoose_2.Schema.Types.ObjectId(city._id.toString()),
                branch: new mongoose_2.Schema.Types.ObjectId(branch._id.toString()),
            },
            {
                firstName: 'Рекрутер',
                lastName: 'Рекрутерів',
                email: 'recruiter@example.com',
                password: '$2b$10$X7UrH5YxX5YxX5YxX5YxX.5YxX5YxX5YxX5YxX5YxX5YxX5YxX',
                role: role_enum_1.UserRole.RECRUITER,
                isActive: true,
                city: new mongoose_2.Schema.Types.ObjectId(city._id.toString()),
                branch: new mongoose_2.Schema.Types.ObjectId(branch._id.toString()),
            },
        ];
        return this.userModel.insertMany(users);
    }
    async createTestCandidates(users, cities, statuses, sources) {
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
                city: new mongoose_2.Schema.Types.ObjectId(cities[Math.floor(Math.random() * cities.length)]._id.toString()),
                source: new mongoose_2.Schema.Types.ObjectId(sources[Math.floor(Math.random() * sources.length)]._id.toString()),
                description: `Опис кандидата ${i + 1}`,
                createdBy: new mongoose_2.Schema.Types.ObjectId(users[Math.floor(Math.random() * users.length)]._id.toString()),
                status: new mongoose_2.Schema.Types.ObjectId(statuses[Math.floor(Math.random() * statuses.length)]._id.toString()),
                employmentType: employmentTypes[Math.floor(Math.random() * employmentTypes.length)],
                gender: genders[Math.floor(Math.random() * genders.length)],
                isActive: true,
            };
            candidates.push(candidate);
        }
        return this.candidateModel.insertMany(candidates);
    }
};
exports.TestService = TestService;
exports.TestService = TestService = TestService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(candidate_schema_1.Candidate.name)),
    __param(2, (0, mongoose_1.InjectModel)(city_schema_1.City.name)),
    __param(3, (0, mongoose_1.InjectModel)(status_schema_1.Status.name)),
    __param(4, (0, mongoose_1.InjectModel)(source_schema_1.Source.name)),
    __param(5, (0, mongoose_1.InjectModel)(branch_schema_1.Branch.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], TestService);
//# sourceMappingURL=test.service.js.map