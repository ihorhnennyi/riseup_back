import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { promises as fs } from 'fs';
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
    @UploadedFile() file: Express.Multer.File,
  ) {
    const createUserDto = JSON.parse(userData); // ✅ Парсим JSON из `FormData`

    console.log('📦 Данные после парсинга:', createUserDto);
    console.log('📷 Загруженный файл:', file);

    if (file) {
      const webpFilename = `${uuidv4()}.webp`;
      const webpPath = `./uploads/users/${webpFilename}`;

      await sharp(file.path).toFormat('webp').toFile(webpPath);
      await fs.unlink(file.path);
      createUserDto.photo = `/uploads/users/${webpFilename}`;
    }

    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    if (
      updateUserDto.birthDate &&
      typeof updateUserDto.birthDate === 'string'
    ) {
      const parsedDate = new Date(updateUserDto.birthDate);
      if (isNaN(parsedDate.getTime())) {
        throw new BadRequestException('Некорректный формат даты');
      }
      updateUserDto.birthDate = parsedDate;
    }
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  // ✅ Загрузка фото
  @Post(':id/upload-photo')
  @Roles(UserRole.ADMIN, UserRole.USER)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/users',
        filename: (req, file, cb) => {
          const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
          cb(null, uniqueName);
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          return cb(new Error('Файл должен быть JPG или PNG'), false);
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 },
    }),
  )
  async uploadPhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const photoUrl = `/uploads/users/${file.filename}`;
    return this.userService.update(id, { photo: photoUrl });
  }
}
