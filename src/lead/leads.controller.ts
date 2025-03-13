import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
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
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createLead(
    @Body('leadData') leadData: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📦 Полученные данные:', leadData);
    console.log('📷 Загруженный файл:', file);

    const createLeadDto: CreateLeadDto = JSON.parse(leadData);

    if (
      !createLeadDto.recruiter ||
      !Types.ObjectId.isValid(createLeadDto.recruiter)
    ) {
      throw new BadRequestException('Некорректный recruiterId');
    }
    createLeadDto.recruiter = new Types.ObjectId(createLeadDto.recruiter);

    if (
      !createLeadDto.statusId ||
      (typeof createLeadDto.statusId === 'string' &&
        (createLeadDto.statusId as string).trim().length === 0)
    ) {
      delete createLeadDto.statusId; // Удаляем поле, если оно пустое
    } else if (typeof createLeadDto.statusId === 'string') {
      if (!Types.ObjectId.isValid(createLeadDto.statusId)) {
        throw new BadRequestException('Некорректный statusId');
      }
      createLeadDto.statusId = new Types.ObjectId(createLeadDto.statusId);
    } else if (createLeadDto.statusId instanceof Types.ObjectId) {
      // Если statusId уже является ObjectId, ничего не делаем
    }

    if (file && file.buffer) {
      const webpFilename = `${uuidv4()}.webp`;
      const webpPath = `./uploads/leads/${webpFilename}`;

      try {
        await sharp(file.buffer).toFormat('webp').toFile(webpPath);
        createLeadDto.photo = `/uploads/leads/${webpFilename}`;
      } catch (err) {
        console.error('❌ Ошибка обработки изображения:', err);
        throw new BadRequestException('Ошибка обработки изображения');
      }
    }

    return this.leadService.create(createLeadDto);
  }

  @Get('by-recruiter/:recruiterId')
  findLeadsByRecruiter(@Param('recruiterId') recruiterId: string) {
    return this.leadService.findLeadsByRecruiter(recruiterId);
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

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: multer.memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async updateLead(
    @Param('id') id: string,
    @Body('leadData') leadData: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📦 Обновление лида:', leadData);
    console.log('📷 Загруженный файл:', file);

    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Неверный формат ID');
    }

    const updateLeadDto: Partial<CreateLeadDto> = JSON.parse(leadData);

    if (updateLeadDto.statusId) {
      updateLeadDto.statusId = new Types.ObjectId(updateLeadDto.statusId);
    }

    const lead = await this.leadService.findOne(id);
    if (!lead) throw new NotFoundException('Лид не найден');

    // ✅ Удаляем старое фото, если оно есть
    if (lead.photo && file) {
      try {
        await unlink(`.${lead.photo}`);
        console.log(`🗑 Старое фото удалено: ${lead.photo}`);
      } catch (err) {
        console.warn(`⚠️ Ошибка при удалении старого фото: ${lead.photo}`);
      }
    }

    if (file) {
      const webpFilename = `${uuidv4()}.webp`;
      const webpPath = `./uploads/leads/${webpFilename}`;

      try {
        await sharp(file.buffer).toFormat('webp').toFile(webpPath);
        updateLeadDto.photo = `/uploads/leads/${webpFilename}`;
      } catch (err) {
        throw new BadRequestException('Ошибка обработки изображения');
      }
    }

    return this.leadService.update(id, updateLeadDto);
  }
}
