import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { UserModule } from '../user/user.module';
import { CarModule } from '../car/car.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, CarModule, ConfigModule.forRoot()],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
