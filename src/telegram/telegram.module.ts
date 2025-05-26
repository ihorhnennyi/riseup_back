import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { City, CitySchema } from '../cities/entities/city.schema'
import { Status, StatusSchema } from '../statuses/entities/status.schema'
import { User, UserSchema } from '../users/entities/user.schema'
import { TelegramController } from './telegram.controller'
import { TelegramService } from './telegram.service'

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: City.name, schema: CitySchema },
      { name: User.name, schema: UserSchema },
      { name: Status.name, schema: StatusSchema },
    ]),
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {} 