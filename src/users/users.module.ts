import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CandidatesModule } from '../candidates/candidates.module'
import { User, UserSchema } from './entities/user.entity'
import { UsersController } from './users.controller'
import { UsersService } from './users.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    CandidatesModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {} 