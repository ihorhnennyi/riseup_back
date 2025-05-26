import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { CreateUserIntegrationDto } from './dto/create-user-integration.dto';
import { Integration } from './entities/integration.schema';
import { UserIntegration } from './entities/user-integration.schema';

@Injectable()
export class IntegrationsService {
  constructor(
    @InjectModel(Integration.name)
    private integrationModel: Model<Integration>,
    @InjectModel(UserIntegration.name)
    private userIntegrationModel: Model<UserIntegration>,
  ) {}

  async createIntegration(createIntegrationDto: CreateIntegrationDto): Promise<Integration> {
    const integration = new this.integrationModel(createIntegrationDto);
    return integration.save();
  }

  async findAllIntegrations(): Promise<Integration[]> {
    return this.integrationModel.find().lean();
  }

  async findOneIntegration(id: string): Promise<Integration> {
    const integration = await this.integrationModel.findById(id).lean();
    if (!integration) throw new NotFoundException('Integration not found');
    return integration;
  }

  async createUserIntegration(userId: string, createUserIntegrationDto: CreateUserIntegrationDto): Promise<UserIntegration> {
    const userIntegration = new this.userIntegrationModel({
      ...createUserIntegrationDto,
      userId: new Types.ObjectId(userId),
    });
    return userIntegration.save();
  }

  async findUserIntegrations(userId: string): Promise<UserIntegration[]> {
    return this.userIntegrationModel.find({ userId: new Types.ObjectId(userId) }).populate('integrationId').lean();
  }

  async findOneUserIntegration(userId: string, id: string): Promise<UserIntegration> {
    const userIntegration = await this.userIntegrationModel.findOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    }).populate('integrationId').lean();
    if (!userIntegration) throw new NotFoundException('UserIntegration not found');
    return userIntegration;
  }

  async removeIntegration(id: string): Promise<Integration> {
    return this.integrationModel.findByIdAndDelete(id).lean();
  }
} 