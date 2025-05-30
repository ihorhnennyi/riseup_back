import { EmploymentType } from '../../common/enums/employment-type.enum';
import { UserRole } from '../../common/enums/role.enum';
import { WorkSchedule } from '../../common/enums/work-schedule.enum';
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    middleName?: string;
    email: string;
    phone?: string;
    password?: string;
    viber?: string;
    whatsapp?: string;
    facebook?: string;
    telegram?: string;
    role: UserRole;
    description?: string;
    position?: string;
    birthDate?: string;
    isActive?: boolean;
    city: string;
    branch: string;
    photoUrl?: string;
    languages?: string[];
    skills?: string[];
    workSchedule?: WorkSchedule;
    employmentType?: EmploymentType;
    startDate?: string;
    experienceYears?: number;
    specializations?: string[];
    linkedinUrl?: string;
    identificationNumber?: string;
    certificates?: string[];
    supervisor?: string;
    responsibilities?: string[];
    emergencyContact?: string;
}
