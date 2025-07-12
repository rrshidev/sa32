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
    console.log(
      'Telegram Bot initialized with token:',
      token.slice(0, 6) + '...',
    );
    this.setupMiniAppHandlers(); 
    this.bot.launch();
  }

  private setupMiniAppHandlers() {
    this.bot.command('start', async (ctx) => {
      console.log('Start command received from:', ctx.from.id);
      // Сохраняем chat_id при команде /start
      const chatId = ctx.chat.id;
      const userId = ctx.from.id.toString();

      // Здесь должна быть логика сохранения связи userId ↔ chatId в БД
      console.log(`User ${userId} started chat with chatId ${chatId}`);

      await ctx.reply('Добро пожаловать!', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Открыть приложение',
                web_app: {
                  url: this.configService.getOrThrow('TELEGRAM_WEBHOOK_URL'),
                },
              },
            ],
          ],
        },
      });
    });
  }

  private async getTelegramUser(
    userId: string,
  ): Promise<{ telegramChatId: string } | null> {
    // Заглушка - в реальности нужно получать из БД
    // Пример реализации:
    // return this.userRepository.findOne({ where: { id: userId } });
    return { telegramChatId: '123456789' }; // Замените на реальный chat_id
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    const user = await this.getTelegramUser(payload.userId); // Добавьте await
    if (user) {
      try {
        await this.bot.telegram.sendMessage(
          user.telegramChatId,
          `*${payload.data.title}*\n${payload.data.content}`,
          { parse_mode: 'Markdown' },
        );
        return true;
      } catch (error) {
        console.error('Failed to send Telegram message:', error);
        return false;
      }
    }
    return false;
  }
}
