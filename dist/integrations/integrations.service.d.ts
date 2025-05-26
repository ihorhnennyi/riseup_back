import { Model } from 'mongoose';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { CreateUserIntegrationDto } from './dto/create-user-integration.dto';
import { Integration } from './entities/integration.schema';
import { UserIntegration } from './entities/user-integration.schema';
export declare class IntegrationsService {
    private integrationModel;
    private userIntegrationModel;
    constructor(integrationModel: Model<Integration>, userIntegrationModel: Model<UserIntegration>);
    createIntegration(createIntegrationDto: CreateIntegrationDto): Promise<Integration>;
    findAllIntegrations(): Promise<Integration[]>;
    findOneIntegration(id: string): Promise<Integration>;
    createUserIntegration(userId: string, createUserIntegrationDto: CreateUserIntegrationDto): Promise<UserIntegration>;
    findUserIntegrations(userId: string): Promise<UserIntegration[]>;
    findOneUserIntegration(userId: string, id: string): Promise<UserIntegration>;
    removeIntegration(id: string): Promise<Integration>;
}
