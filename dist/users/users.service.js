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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bcrypt = require("bcrypt");
const mongoose_2 = require("mongoose");
const role_enum_1 = require("../common/enums/role.enum");
const user_schema_1 = require("../users/entities/user.schema");
const password_utils_1 = require("../utils/password.utils");
let UsersService = UsersService_1 = class UsersService {
    constructor(userModel) {
        this.userModel = userModel;
        this.logger = new common_1.Logger(UsersService_1.name);
    }
    async findById(id) {
        const objectId = mongoose_2.Types.ObjectId.isValid(id) ? new mongoose_2.Types.ObjectId(id) : id;
        const user = await this.userModel.findById(objectId)
            .populate('branch', 'name')
            .populate('city', 'name')
            .lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            message: 'User found',
            data: this.excludeSensitiveData(user),
        };
    }
    async findByEmail(email) {
        this.logger.debug(`Поиск пользователя по email: ${email}`);
        try {
            const user = await this.userModel.findOne({ email }).lean();
            this.logger.debug(`Результат поиска: ${JSON.stringify(user)}`);
            if (!user) {
                this.logger.debug('Пользователь не найден');
                throw new common_1.NotFoundException('User not found');
            }
            return user;
        }
        catch (error) {
            this.logger.error(`Ошибка при поиске пользователя: ${error.message}`);
            throw error;
        }
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.userModel.findByIdAndUpdate(userId, {
            refreshToken: refreshToken,
            lastLogin: refreshToken ? new Date() : undefined,
        });
    }
    async createSuperAdmin(createSuperAdminDto) {
        try {
            const existingSuperAdmin = await this.userModel.findOne({ role: role_enum_1.UserRole.SUPER_ADMIN });
            if (existingSuperAdmin) {
                throw new common_1.ConflictException('Super Admin already exists');
            }
            const existingUser = await this.userModel.findOne({ email: createSuperAdminDto.email });
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
            const salt = await bcrypt.genSalt();
            const hashedPassword = await bcrypt.hash(createSuperAdminDto.password, salt);
            const superAdmin = new this.userModel(Object.assign(Object.assign({}, createSuperAdminDto), { password: hashedPassword, role: role_enum_1.UserRole.SUPER_ADMIN, isEmailVerified: true }));
            const savedUser = await superAdmin.save();
            const userResponse = this.excludeSensitiveData(savedUser.toObject());
            return {
                success: true,
                message: 'Super Admin has been successfully created',
                data: userResponse,
            };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException('Error creating super admin');
        }
    }
    async create(createUserDto) {
        this.logger.debug(`Creating user: ${JSON.stringify(createUserDto)}`);
        const existingUser = await this.userModel.findOne({ email: createUserDto.email });
        if (existingUser) {
            throw new common_1.ConflictException('User with this email already exists');
        }
        const salt = await bcrypt.genSalt();
        const password = createUserDto.password || (0, password_utils_1.generateRandomPassword)();
        const hashedPassword = await bcrypt.hash(password, salt);
        const createdUser = new this.userModel(Object.assign(Object.assign({}, createUserDto), { city: new mongoose_2.Types.ObjectId(createUserDto.city), branch: new mongoose_2.Types.ObjectId(createUserDto.branch), password: hashedPassword }));
        const savedUser = await createdUser.save();
        if (!createUserDto.password) {
            return Object.assign(Object.assign({}, savedUser.toObject()), { generatedPassword: password });
        }
        return savedUser.toObject();
    }
    async findAll(filterDto, currentUserRole) {
        const { role, search, branch, city, page = 1, limit = 10 } = filterDto;
        const query = {};
        if (role)
            query.role = role;
        if (branch)
            query.branch = branch;
        if (city)
            query.city = city;
        if (search) {
            query.$or = [
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (currentUserRole !== role_enum_1.UserRole.SUPER_ADMIN && currentUserRole !== role_enum_1.UserRole.ADMIN && branch) {
            query.branch = branch;
        }
        const total = await this.userModel.countDocuments(query);
        const users = await this.userModel.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('branch', 'name')
            .populate('city', 'name')
            .lean();
        const totalPages = Math.ceil(total / limit);
        return {
            success: true,
            message: 'Users successfully retrieved',
            data: users.map(user => this.excludeSensitiveData(user)),
            total,
            page,
            totalPages
        };
    }
    async update(id, updateUserDto) {
        const userToUpdate = await this.findById(id);
        if (userToUpdate.data.role === role_enum_1.UserRole.SUPER_ADMIN && updateUserDto.role && updateUserDto.role !== role_enum_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Cannot change Super Admin role');
        }
        if (updateUserDto.email) {
            const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
            if (existingUser && existingUser._id.toString() !== id) {
                throw new common_1.ConflictException('Email already exists');
            }
        }
        if (updateUserDto.city) {
            console.log('city before:', updateUserDto.city, typeof updateUserDto.city);
            updateUserDto.city = new mongoose_2.Types.ObjectId(updateUserDto.city);
            console.log('city after:', updateUserDto.city, typeof updateUserDto.city);
        }
        if (updateUserDto.branch) {
            console.log('branch before:', updateUserDto.branch, typeof updateUserDto.branch);
            updateUserDto.branch = new mongoose_2.Types.ObjectId(updateUserDto.branch);
            console.log('branch after:', updateUserDto.branch, typeof updateUserDto.branch);
        }
        const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true })
            .populate('branch', 'name')
            .populate('city', 'name')
            .lean();
        return {
            success: true,
            message: 'User updated',
            data: this.excludeSensitiveData(updatedUser),
        };
    }
    async remove(id) {
        const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true })
            .populate('branch', 'name')
            .populate('city', 'name')
            .lean();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return {
            success: true,
            message: 'User removed',
            data: this.excludeSensitiveData(user),
        };
    }
    excludeSensitiveData(user) {
        const { password, refreshToken } = user, rest = __rest(user, ["password", "refreshToken"]);
        return rest;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map