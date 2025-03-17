import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadService } from './lead.service';
import { Lead } from './schemas/lead.schema';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  /**
   * 📌 Создание нового лида
   */
  @Post()
  async createLead(@Body() createLeadDto: CreateLeadDto) {
    console.log('📦 Полученные данные для создания:', createLeadDto);

    // Проверяем recruiterId (обязательно поле)
    if (
      !createLeadDto.recruiter ||
      !Types.ObjectId.isValid(createLeadDto.recruiter)
    ) {
      throw new BadRequestException('Некорректный recruiterId');
    }

    // Проверка statusId, если передан
    if (createLeadDto.statusId) {
      if (!Types.ObjectId.isValid(String(createLeadDto.statusId))) {
        throw new BadRequestException('Некорректный statusId');
      }
    } else {
      delete createLeadDto.statusId;
    }

    try {
      console.log('📦 Данные перед отправкой в сервис:', createLeadDto);
      const lead = await this.leadService.create(createLeadDto);
      console.log('✅ Лид успешно создан:', lead);
      return lead;
    } catch (error) {
      console.error('❌ Ошибка при создании лида:', error);
      throw new BadRequestException('Ошибка создания лида');
    }
  }

  /**
   * 📌 Получение всех лидов
   */
  @Get()
  async getAllLeads(@Req() req): Promise<Partial<Lead>[]> {
    const currentUser = req.user; // 🔥 Получаем пользователя из запроса
    return this.leadService.findAll(currentUser);
  }

  /**
   * 📌 Получение лида по ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    console.log(`📌 Запрос на получение лида с ID: ${id}`);

    if (!Types.ObjectId.isValid(id)) {
      console.error(`❌ Ошибка: Неверный формат ID - ${id}`);
      throw new BadRequestException('Неверный формат ID');
    }

    try {
      const lead = await this.leadService.findOne(id);
      console.log(`✅ Лид найден:`, lead);
      return lead;
    } catch (error) {
      console.error(`❌ Ошибка при получении лида:`, error);
      throw new BadRequestException('Ошибка загрузки лида');
    }
  }

  /**
   * 📌 Обновление лида
   */
  @Put(':id')
  async updateLead(
    @Param('id') id: string,
    @Body() updateLeadDto: UpdateLeadDto, // ✅ Используем новый DTO
  ) {
    console.log(`🔄 Обновление лида с ID: ${id}`, updateLeadDto);
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный формат ID');
    }
    try {
      const updatedLead = await this.leadService.update(id, updateLeadDto);
      console.log('✅ Лид обновлён:', updatedLead);
      return updatedLead;
    } catch (error) {
      console.error(`❌ Ошибка при обновлении лида с ID ${id}:`, error);
      throw new BadRequestException('Ошибка обновления лида');
    }
  }
  /**
   * 📌 Удаление лида
   */
  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`🗑 Запрос на удаление лида с ID: ${id}`);

    console.log(`🗑 Проверяем ID перед удалением: ${id}`);
    if (!Types.ObjectId.isValid(id)) {
      console.error(`❌ Ошибка: Неверный формат ID - ${id}`);
      throw new BadRequestException('Неверный формат ID');
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный формат ID');
    }
    try {
      const result = await this.leadService.remove(id);
      console.log(`✅ Лид с ID ${id} успешно удалён`);
      return result;
    } catch (error) {
      console.error(`❌ Ошибка при удалении лида с ID ${id}:`, error);
      throw new BadRequestException('Ошибка удаления лида');
    }
  }
}
