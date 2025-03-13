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
import { promises as fs } from 'fs';
import { Types } from 'mongoose';
import { diskStorage } from 'multer';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../enum/user-role.enum';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('photo', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(
            new BadRequestException('Файл должен быть JPG, PNG или JPEG'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async createUser(
    @Body('userData') userData: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    let createUserDto;
    try {
      createUserDto = JSON.parse(userData);
    } catch {
      throw new BadRequestException('Ошибка парсинга JSON');
    }

    if (file) {
      try {
        const webpFilename = `${uuidv4()}.webp`;
        const webpPath = `./uploads/users/${webpFilename}`;

        await sharp(file.path).toFormat('webp').toFile(webpPath);
        await fs.unlink(file.path);
        createUserDto.photo = `/uploads/users/${webpFilename}`;
      } catch {
        throw new BadRequestException('Ошибка обработки изображения');
      }
    }

    if (Array.isArray(createUserDto.leads)) {
      createUserDto.leads = createUserDto.leads.map(
        (leadId) => new Types.ObjectId(leadId),
      );
    }

    return this.userService.create(createUserDto);
  }

  @Get(':id/leads')
  async getUserLeads(@Param('id') id: string) {
    console.log(`🔍 Получение лидов пользователя с ID: ${id}`);
    return this.userService.getUserLeads(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    return user;
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body('userData') userData: string | UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    console.log('📥 Полученные данные (userData):', userData);

    if (!userData) {
      throw new BadRequestException('❌ userData не передан в запросе');
    }

    let updateUserDto: UpdateUserDto;
    try {
      updateUserDto =
        typeof userData === 'string' ? JSON.parse(userData) : userData;
    } catch (error) {
      throw new BadRequestException('Ошибка парсинга JSON');
    }

    if (updateUserDto.branch && Types.ObjectId.isValid(updateUserDto.branch)) {
      updateUserDto.branch = updateUserDto.branch.toString();
    }

    if (updateUserDto.leads) {
      updateUserDto.leads = updateUserDto.leads.map((lead) =>
        typeof lead === 'string' ? new Types.ObjectId(lead) : lead,
      );
    }

    if (file) {
      try {
        const webpFilename = `${uuidv4()}.webp`;
        const webpPath = `./uploads/users/${webpFilename}`;

        await sharp(file.path).toFormat('webp').toFile(webpPath);
        await fs.unlink(file.path);
        updateUserDto.photo = `/uploads/users/${webpFilename}`;
      } catch (err) {
        throw new BadRequestException('Ошибка обработки изображения');
      }
    }

    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
