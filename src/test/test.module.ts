import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Branch, BranchSchema } from '../branches/schemas/branch.schema';
import { Candidate, CandidateSchema } from '../candidates/entities/candidate.schema';
import { City, CitySchema } from '../cities/schemas/city.schema';
import { Source, SourceSchema } from '../sources/schemas/source.schema';
import { Status, StatusSchema } from '../statuses/schemas/status.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { TestController } from './test.controller';
import { TestService } from './test.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Candidate.name, schema: CandidateSchema },
      { name: City.name, schema: CitySchema },
      { name: Status.name, schema: StatusSchema },
      { name: Source.name, schema: SourceSchema },
      { name: Branch.name, schema: BranchSchema },
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
})
export class TestModule {} 