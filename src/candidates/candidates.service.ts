import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { TelegramService } from '../telegram/telegram.service'
import { CreateCandidateDto } from './dto/create-candidate.dto'
import { UpdateCandidateDto } from './dto/update-candidate.dto'
import { Candidate } from './entities/candidate.schema'

@Injectable()
export class CandidatesService {
  private readonly logger = new Logger(CandidatesService.name);

  constructor(
    @InjectModel(Candidate.name)
    private candidateModel: Model<Candidate>,
    private readonly telegramService: TelegramService,
  ) {}

  private toObjectId(id: any): Types.ObjectId | undefined {
    if (!id) return undefined;
    if (id instanceof Types.ObjectId) return id;
    try {
      return new Types.ObjectId(id);
    } catch {
      return undefined;
    }
  }

  private normalizeRefs(dto: any) {
    return {
      ...dto,
      status: this.toObjectId(dto.status),
      city: this.toObjectId(dto.city),
      source: this.toObjectId(dto.source),
      createdBy: this.toObjectId(dto.createdBy),
      callbackStatus: this.toObjectId(dto.callbackStatus),
      assignedRecruiter: this.toObjectId(dto.assignedRecruiter),
      integrationId: this.toObjectId(dto.integrationId),
    };
  }

  async create(createCandidateDto: CreateCandidateDto): Promise<Candidate> {
    // Устанавливаем значения по умолчанию
    const candidateData = this.normalizeRefs({
      ...createCandidateDto,
      createdBy: createCandidateDto.createdBy || new Types.ObjectId('507f1f77bcf86cd799439011'), // ID тестового пользователя
      status: createCandidateDto.status || new Types.ObjectId('662f1f77bcf86cd799439013'), // ID тестового статуса
      isActive: createCandidateDto.isActive ?? true,
    });

    const candidate = new this.candidateModel(candidateData);
    const savedCandidate = await candidate.save();
    await this.telegramService.sendCandidateNotification(savedCandidate, 'created');
    return savedCandidate;
  }

  private validateObjectId(id: string): Types.ObjectId {
    try {
      return new Types.ObjectId(id);
    } catch (error) {
      throw new BadRequestException('Invalid ID format');
    }
  }

  private async paginateQuery(filter: any, page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.candidateModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'firstName lastName email role')
        .populate('city', 'name')
        .populate('source', 'name')
        .populate('status', 'name color description')
        .populate('callbackStatus', 'name color description')
        .populate('assignedRecruiter', 'firstName lastName email role')
        .populate('integrationId', 'name')
        .lean(),
      this.candidateModel.countDocuments(filter),
    ]);
    const totalPages = Math.ceil(total / limit);
    return { data, total, page, totalPages };
  }

  async findAll(query: any = {}): Promise<{ data: Candidate[]; total: number; page: number; totalPages: number }> {
    const filter: any = {};
    
    // Фильтры по ID
    if (query.status) filter.status = this.validateObjectId(query.status);
    if (query.city) filter.city = this.validateObjectId(query.city);
    if (query.source) filter.source = this.validateObjectId(query.source);
    if (query.assignedRecruiter) filter.assignedRecruiter = this.validateObjectId(query.assignedRecruiter);
    if (query.createdBy) filter.createdBy = this.validateObjectId(query.createdBy);
    
    // Булевы фильтры
    if (query.isActive !== undefined) filter.isActive = query.isActive === 'true' || query.isActive === true;
    
    // Фильтры по дате
    if (query.fromDate || query.toDate) {
      filter.createdAt = {};
      if (query.fromDate) filter.createdAt.$gte = new Date(query.fromDate);
      if (query.toDate) filter.createdAt.$lte = new Date(query.toDate);
    }
    
    // Поиск по тексту
    if (query.q) {
      const regex = new RegExp(query.q, 'i');
      filter.$or = [
        { firstName: regex },
        { lastName: regex },
        { middleName: regex },
        { email: regex },
        { phone: regex },
        { description: regex },
      ];
    }

    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;

    return this.paginateQuery(filter, page, limit);
  }

  async findOne(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel
      .findById(this.validateObjectId(id))
      .populate('createdBy', 'firstName lastName email role')
      .populate('city', 'name')
      .populate('source', 'name')
      .populate('status', 'name color description')
      .populate('callbackStatus', 'name color description')
      .populate('assignedRecruiter', 'firstName lastName email role')
      .populate('integrationId', 'name')
      .lean();
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async update(id: string, updateCandidateDto: UpdateCandidateDto): Promise<Candidate> {
    const candidate = await this.candidateModel.findByIdAndUpdate(
      this.validateObjectId(id),
      this.normalizeRefs(updateCandidateDto),
      { new: true }
    )
      .populate('createdBy', 'firstName lastName email role')
      .populate('city', 'name')
      .populate('source', 'name')
      .populate('status', 'name color description')
      .populate('callbackStatus', 'name color description')
      .populate('assignedRecruiter', 'firstName lastName email role')
      .populate('integrationId', 'name')
      .lean();
    
    if (!candidate) throw new NotFoundException('Candidate not found');
    await this.telegramService.sendCandidateNotification(candidate, 'updated');
    return candidate;
  }

  async remove(id: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findByIdAndDelete(this.validateObjectId(id))
      .populate('createdBy', 'firstName lastName email role')
      .populate('city', 'name')
      .populate('source', 'name')
      .populate('status', 'name color description')
      .populate('callbackStatus', 'name color description')
      .populate('assignedRecruiter', 'firstName lastName email role')
      .populate('integrationId', 'name')
      .lean();
    if (!candidate) throw new NotFoundException('Candidate not found');
    return candidate;
  }

  async updateStatus(candidateId: string, newStatus: string): Promise<Candidate> {
    const candidate = await this.candidateModel.findById(this.validateObjectId(candidateId));
    if (!candidate) {
      throw new NotFoundException('Candidate not found');
    }

    candidate.status = this.validateObjectId(newStatus);
    return candidate.save();
  }

  async findDuplicateByName(firstName: string, lastName: string): Promise<Candidate | null> {
    try {
      console.log('findDuplicateByName:', { firstName, lastName });
      return await this.candidateModel.findOne({
        firstName: firstName,
        lastName: lastName,
      }).lean();
    } catch (e) {
      console.error('Error in findDuplicateByName:', e);
      throw new BadRequestException('Ошибка поиска дубликата: ' + (e?.message || e));
    }
  }
} 