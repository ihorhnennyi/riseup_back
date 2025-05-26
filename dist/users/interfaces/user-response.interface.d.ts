import { User } from '../entities/user.entity';
export declare class UserResponse {
    success: boolean;
    message: string;
    data: Partial<User>;
    error?: string;
}
