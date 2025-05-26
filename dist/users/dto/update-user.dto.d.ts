import { UserRole } from '../../common/enums/role.enum';
import { CreateUserDto } from './create-user.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<CreateUserDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    role?: UserRole;
    department?: string;
    position?: string;
    city?: any;
    branch?: any;
}
export {};
