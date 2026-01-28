import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationPayload } from '../../interfaces/notification-payload.interface';
import { Telegraf } from 'telegraf';
import { User } from '../../../entities/user.entity';

@Injectable()
export class TelegramAdapter {
  private bot: Telegraf;

  constructor(
    private configService: ConfigService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    const token: string = configService.getOrThrow('TELEGRAM_BOT_TOKEN');
    this.bot = new Telegraf(token);
    console.log(
      'Telegram Bot initialized with token:',
      token.slice(0, 6) + '...',
    );
    this.setupMiniAppHandlers();
    void this.bot.launch();
  }

  private setupMiniAppHandlers() {
    this.bot.command('start', async (ctx) => {
      console.log('Start command received from:', ctx.from.id);
      const chatId = ctx.chat.id.toString();
      const telegramId = ctx.from.id.toString();

      // Ищем пользователя по telegramId или создаем связь
      let user = await this.userRepository.findOne({ 
        where: { telegramId } 
      });

      if (user) {
        // Обновляем chatId если найден пользователь
        user.telegramChatId = chatId;
        await this.userRepository.save(user);
        console.log(`Updated user ${user.id} with chatId ${chatId}`);
      } else {
        console.log(`User with telegramId ${telegramId} not found in database`);
        await ctx.reply(
          '🔍 *Пользователь не найден*\n\n' +
          'Пожалуйста, сначала зарегистрируйтесь в приложении и укажите ваш Telegram ID в профиле.\n' +
          'Ваш Telegram ID: `' + telegramId + '`',
          { parse_mode: 'Markdown' }
        );
        return;
      }

      await ctx.reply('✅ *Уведомления включены!*\n\nТеперь вы будете получать уведомления о записях в этом чате.', {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: '🚀 Открыть приложение',
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
    const user = await this.userRepository.findOne({ 
      where: { id: userId } 
    });
    
    if (user && user.telegramChatId) {
      return { telegramChatId: user.telegramChatId };
    }
    
    return null;
  }

  async send(payload: NotificationPayload): Promise<boolean> {
    const user = await this.getTelegramUser(payload.userId);
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
