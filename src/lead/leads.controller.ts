import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs/promises';
import { Types } from 'mongoose';
import * as multer from 'multer';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateLeadDto } from './dto/create-lead.dto';
import { LeadService } from './lead.service';

@Controller('leads')
@UseGuards(JwtAuthGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      // ✅ Поле должно называться `photo`
      storage: multer.memoryStorage(), // 📌 Используем память, а не диск
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createLead(
    @Body('leadData') leadData: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📦 Полученные данные:', leadData);
    console.log('📷 Загруженный файл:', file);

    if (!file) {
      console.error('❌ Ошибка: Файл не был загружен!');
      throw new BadRequestException('Файл обязателен!');
    }

    const createLeadDto: CreateLeadDto = JSON.parse(leadData);

    // ✅ Преобразование statusId
    if (
      createLeadDto.statusId &&
      Types.ObjectId.isValid(createLeadDto.statusId)
    ) {
      createLeadDto.statusId = new Types.ObjectId(createLeadDto.statusId);
    } else {
      console.error('❌ Ошибка: Некорректный statusId', createLeadDto.statusId);
      throw new BadRequestException('Некорректный statusId');
    }

    // 🛠 Конвертируем фото в WEBP
    const webpFilename = `${uuidv4()}.webp`;
    const webpPath = `./uploads/leads/${webpFilename}`;

    try {
      await sharp(file.buffer).toFormat('webp').toFile(webpPath);

      createLeadDto.photo = `/uploads/leads/${webpFilename}`;
    } catch (err) {
      console.error('❌ Ошибка обработки изображения:', err);
      throw new BadRequestException('Ошибка обработки изображения');
    }

    return this.leadService.create(createLeadDto);
  }

  @Get()
  findAll() {
    return this.leadService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    // Проверка на валидность ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный формат ID');
    }

    const lead = await this.leadService.findOne(id); // Теперь id можно безопасно передавать
    if (!lead) {
      throw new NotFoundException('Лид не найден');
    }
    return lead;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    console.log(`🗑 Удаление лида с ID: ${id}`);

    // 1️⃣ Проверяем, существует ли запись
    const lead = await this.leadService.findOne(id);
    if (!lead) {
      console.error('❌ Ошибка: Лид не найден!');
      throw new BadRequestException('Лид не найден');
    }

    // 2️⃣ Удаляем фото, если оно есть
    if (lead.photo) {
      const filePath = `.${lead.photo}`; // Пути хранятся как `/uploads/leads/...`
      try {
        await unlink(filePath); // ✅ Удаляем файл
        console.log(`🗑 Файл удалён: ${filePath}`);
      } catch (err) {
        console.warn(`⚠️ Файл не найден или уже удалён: ${filePath}`);
      }
    }

    // 3️⃣ Удаляем саму запись из БД
    return this.leadService.remove(id);
  }
}
