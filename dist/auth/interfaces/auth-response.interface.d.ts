import { UserRole } from '../../common/enums/role.enum';
import { Tokens } from './tokens.interface';
declare class AuthUserInfo {
    id: string;
    firstName: string;
    role: UserRole;
}
export declare class AuthResponse {
    success: boolean;
    message: string;
    data: {
        user: AuthUserInfo;
        tokens: Tokens;
    };
}
export {};
