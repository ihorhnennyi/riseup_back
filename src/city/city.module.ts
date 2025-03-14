import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { CityController } from './city.controller';
import { CityService } from './city.service';
import { City, CitySchema } from './schemas/city.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: City.name, schema: CitySchema }]),
    AuthModule,
  ],
  controllers: [CityController],
  providers: [CityService],
  exports: [CityService],
})
export class CityModule {}
