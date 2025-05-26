import { User } from '../entities/user.entity';

export interface UserWithPassword extends User {
  generatedPassword?: string;
} 