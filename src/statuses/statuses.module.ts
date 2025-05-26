import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Status, StatusSchema } from './entities/status.schema';
import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Status.name, schema: StatusSchema }])],
  controllers: [StatusesController],
  providers: [StatusesService],
  exports: [StatusesService],
})
export class StatusesModule {} 