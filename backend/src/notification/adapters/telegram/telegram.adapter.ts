import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NotificationPayload } from '../../interfaces/notification-payload.interface';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramAdapter {
  private bot: Telegraf;

  constructor(private configService: ConfigService) {
    const token: string = configService.getOrThrow('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    const user = this.getTelegramUser(payload.userId);
    if (user) {
      await this.bot.telegram.sendMessage(
        user.telegramChatId,
        `*${payload.data.title}*\n${payload.data.content}`,
        { parse_mode: 'Markdown' },
      );
      return true;
    }
    return false;
  }

  private getTelegramUser(userId: string) {
    // Реализация получения chat_id пользователя из БД
    return { telegramChatId: '123456789' };
  }
}
