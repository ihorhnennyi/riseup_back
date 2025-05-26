import { UserRole } from '../../common/enums/role.enum';
export declare class GetUsersFilterDto {
    role?: UserRole;
    search?: string;
    branch?: string;
    city?: string;
    page?: number;
    limit?: number;
}
