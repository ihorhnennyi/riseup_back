import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import * as bcrypt from 'bcrypt'
import { Model, Types } from 'mongoose'
import { UserRole } from '../common/enums/role.enum'
import { CreateSuperAdminDto } from '../users/dto/create-super-admin.dto'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UpdateUserDto } from '../users/dto/update-user.dto'
import { User } from '../users/entities/user.schema'
import { UserResponse } from '../users/interfaces/user-response.interface'
import { generateRandomPassword } from '../utils/password.utils'
import { GetUsersFilterDto } from './dto/get-users-filter.dto'

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name)

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async findById(id: string): Promise<UserResponse> {
    const objectId = Types.ObjectId.isValid(id) ? new Types.ObjectId(id) : id;
    const user = await this.userModel.findById(objectId)
      .populate('branch', 'name')
      .populate('city', 'name')
      .lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      message: 'User found',
      data: this.excludeSensitiveData(user),
    };
  }

  async findByEmail(email: string): Promise<User> {
    this.logger.debug(`Поиск пользователя по email: ${email}`);
    try {
      const user = await this.userModel.findOne({ email }).lean();
      this.logger.debug(`Результат поиска: ${JSON.stringify(user)}`);
      if (!user) {
        this.logger.debug('Пользователь не найден');
        throw new NotFoundException('User not found');
      }
      return user as any;
    } catch (error) {
      this.logger.error(`Ошибка при поиске пользователя: ${error.message}`);
      throw error;
    }
  }

  async updateRefreshToken(userId: string, refreshToken: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(userId, {
      refreshToken: refreshToken,
      lastLogin: refreshToken ? new Date() : undefined,
    });
  }

  async createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto): Promise<UserResponse> {
    try {
      const existingSuperAdmin = await this.userModel.findOne({ role: UserRole.SUPER_ADMIN });
      if (existingSuperAdmin) {
        throw new ConflictException('Super Admin already exists');
      }
      const existingUser = await this.userModel.findOne({ email: createSuperAdminDto.email });
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(createSuperAdminDto.password, salt);
      const superAdmin = new this.userModel({
        ...createSuperAdminDto,
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isEmailVerified: true,
      });
      const savedUser = await superAdmin.save();
      const userResponse = this.excludeSensitiveData(savedUser.toObject());
      return {
        success: true,
        message: 'Super Admin has been successfully created',
        data: userResponse,
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating super admin');
    }
  }

  async create(createUserDto: CreateUserDto): Promise<any> {
    this.logger.debug(`Creating user: ${JSON.stringify(createUserDto)}`);
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const salt = await bcrypt.genSalt();
    const password = createUserDto.password || generateRandomPassword();
    const hashedPassword = await bcrypt.hash(password, salt);
    const createdUser = new this.userModel({
      ...createUserDto,
      city: new Types.ObjectId(createUserDto.city),
      branch: new Types.ObjectId(createUserDto.branch),
      password: hashedPassword,
    });
    const savedUser = await createdUser.save();
    if (!createUserDto.password) {
      return { ...savedUser.toObject(), generatedPassword: password };
    }
    return savedUser.toObject();
  }

  async findAll(filterDto: GetUsersFilterDto, currentUserRole: UserRole): Promise<{
    success: boolean;
    message: string;
    data: Partial<User>[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const { role, search, branch, city, page = 1, limit = 10 } = filterDto;
    const query: any = { };
    if (role) query.role = role;
    if (branch) query.branch = branch;
    if (city) query.city = city;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (currentUserRole !== UserRole.SUPER_ADMIN && currentUserRole !== UserRole.ADMIN && branch) {
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse> {
    const userToUpdate = await this.findById(id);
    if (userToUpdate.data.role === UserRole.SUPER_ADMIN && updateUserDto.role && updateUserDto.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Cannot change Super Admin role');
    }
    if (updateUserDto.email) {
      const existingUser = await this.userModel.findOne({ email: updateUserDto.email });
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException('Email already exists');
      }
    }
    if (updateUserDto.city) {
      console.log('city before:', updateUserDto.city, typeof updateUserDto.city);
      updateUserDto.city = new Types.ObjectId(updateUserDto.city);
      console.log('city after:', updateUserDto.city, typeof updateUserDto.city);
    }
    if (updateUserDto.branch) {
      console.log('branch before:', updateUserDto.branch, typeof updateUserDto.branch);
      updateUserDto.branch = new Types.ObjectId(updateUserDto.branch);
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

  async remove(id: string): Promise<UserResponse> {
    const user = await this.userModel.findByIdAndUpdate(id, { isActive: false }, { new: true })
      .populate('branch', 'name')
      .populate('city', 'name')
      .lean();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      success: true,
      message: 'User removed',
      data: this.excludeSensitiveData(user),
    };
  }

  private excludeSensitiveData(user: any): Partial<User> {
    const { password, refreshToken, ...rest } = user;
    return rest;
  }
} 