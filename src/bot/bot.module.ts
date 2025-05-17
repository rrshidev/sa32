import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotService } from './bot.service';

@Module({
  imports: [ConfigModule.forRoot()],
  providers: [BotService],
  exports: [BotService],
})
export class BotModule {}
