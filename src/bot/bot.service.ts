import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BotService {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
    this.bot = new Telegraf(this.configService.get('TELEGRAM_BOT_TOKEN'));
    this.initHandlers();
  }

  private initHandlers() {
    this.bot.start((ctx) => ctx.reply('Добро пожаловать в ServiceAutoBot! 🚗'));
    this.bot.command('help', (ctx) => ctx.reply('Помощь: /start, /help'));
  }

  async startPolling() {
    await this.bot.launch();
  }
}
