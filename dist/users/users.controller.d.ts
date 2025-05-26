import { CandidatesService } from '../candidates/candidates.service';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUsersFilterDto } from './dto/get-users-filter.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserResponse } from './interfaces/user-response.interface';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    private readonly candidatesService;
    constructor(usersService: UsersService, candidatesService: CandidatesService);
    createSuperAdmin(createSuperAdminDto: CreateSuperAdminDto): Promise<UserResponse>;
    create(createUserDto: CreateUserDto): Promise<UserResponse>;
    findAll(filterDto: GetUsersFilterDto, currentUser: User): Promise<{
        success: boolean;
        message: string;
        data: Partial<import("./entities/user.schema").User>[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    findOne(id: string): Promise<UserResponse>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse>;
    updatePatch(id: string, updateUserDto: UpdateUserDto): Promise<UserResponse>;
    remove(id: string): Promise<UserResponse>;
    getCandidatesByRecruiter(id: string): Promise<{
        data: import("../candidates/entities/candidate.schema").Candidate[];
        total: number;
        page: number;
        totalPages: number;
    }>;
}
