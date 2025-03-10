import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateIntegrationDto } from './dto/create-integration.dto';
import { UpdateIntegrationDto } from './dto/update-integration.dto';
import { Integration, IntegrationDocument } from './schema/integration.schema';

@Injectable()
export class IntegrationService {
  constructor(
    @InjectModel(Integration.name)
    private integrationModel: Model<IntegrationDocument>,
  ) {}

  async create(
    createIntegrationDto: CreateIntegrationDto,
  ): Promise<Integration> {
    return this.integrationModel.create(createIntegrationDto);
  }

  async findAll(): Promise<Integration[]> {
    return this.integrationModel.find().exec();
  }

  async findOne(id: string): Promise<Integration> {
    const integration = await this.integrationModel.findById(id).exec();
    if (!integration) {
      throw new NotFoundException('Интеграция не найдена');
    }
    return integration;
  }

  async update(
    id: string,
    updateIntegrationDto: UpdateIntegrationDto,
  ): Promise<Integration> {
    const updatedIntegration = await this.integrationModel
      .findByIdAndUpdate(id, updateIntegrationDto, { new: true })
      .exec();
    if (!updatedIntegration) {
      throw new NotFoundException('Интеграция не найдена');
    }
    return updatedIntegration;
  }

  async remove(id: string): Promise<{ message: string }> {
    const deletedIntegration = await this.integrationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedIntegration) {
      throw new NotFoundException('Интеграция не найдена');
    }
    return { message: 'Интеграция успешно удалена' };
  }
}
