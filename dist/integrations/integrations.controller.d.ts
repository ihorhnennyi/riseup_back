import { CreateIntegrationDto } from './dto/create-integration.dto';
import { CreateUserIntegrationDto } from './dto/create-user-integration.dto';
import { IntegrationsService } from './integrations.service';
export declare class IntegrationsController {
    private readonly integrationsService;
    constructor(integrationsService: IntegrationsService);
    createIntegration(createIntegrationDto: CreateIntegrationDto): Promise<import("./entities/integration.schema").Integration>;
    findAllIntegrations(): Promise<import("./entities/integration.schema").Integration[]>;
    findOneIntegration(id: string): Promise<import("./entities/integration.schema").Integration>;
    createUserIntegration(req: any, createUserIntegrationDto: CreateUserIntegrationDto): Promise<import("./entities/user-integration.schema").UserIntegration>;
    findUserIntegrations(req: any): Promise<import("./entities/user-integration.schema").UserIntegration[]>;
    findOneUserIntegration(req: any, id: string): Promise<import("./entities/user-integration.schema").UserIntegration>;
    removeIntegration(id: string): Promise<import("./entities/integration.schema").Integration>;
}
