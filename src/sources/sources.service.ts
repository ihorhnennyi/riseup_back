import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';
import { Source } from './entities/source.schema';

@Injectable()
export class SourcesService {
  constructor(
    @InjectModel(Source.name)
    private sourceModel: Model<Source>,
  ) {}

  async create(createSourceDto: CreateSourceDto): Promise<Source> {
    const source = new this.sourceModel(createSourceDto);
    return source.save();
  }

  async findAll(): Promise<Source[]> {
    return this.sourceModel.find().lean();
  }

  async findOne(id: string): Promise<Source> {
    const source = await this.sourceModel.findById(id).lean();
    if (!source) throw new NotFoundException('Source not found');
    return source;
  }

  async update(id: string, updateSourceDto: UpdateSourceDto): Promise<Source> {
    return this.sourceModel.findByIdAndUpdate(id, updateSourceDto, { new: true }).lean();
  }

  async remove(id: string): Promise<Source> {
    return this.sourceModel.findByIdAndDelete(id).lean();
  }
} 