import { Model } from 'mongoose';
import { UserRole } from '../common/enums/role.enum';
import { CreateSuperAdminDto } from '../users/dto/create-super-admin.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { User } from '../users/entities/user.schema';
import { UserResponse } from '../users/interfaces/user-response.interface';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
export declare class UsersService {
    private userModel;
    private readonly logger;
    constructor(userModel: Model<User>);
    findById(id: string): Promise<UserResponse>;
    findByEmail(email: string): Promise<User>;
    updateRefreshToken(userId: string, refreshToken: string | null): Promise<void>;
    createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto): Promise<UserResponse>;
    create(createUserDto: CreateUserDto): Promise<any>;
    findAll(filterDto: GetUsersFilterDto, currentUserRole: UserRole): Promise<{
        success: boolean;
        message: string;
        data: Partial<User>[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse>;
    remove(id: string): Promise<UserResponse>;
    private excludeSensitiveData;
}
