import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CarService } from '../car/car.service';
import { Markup } from 'telegraf';
import { Context } from 'telegraf';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class BotService {
  private bot: Telegraf;
  private registrationState: Map<number, { step: string; data: any }> =
    new Map();

  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private carService: CarService,
  ) {
    this.bot = new Telegraf(this.configService.get('TELEGRAM_BOT_TOKEN'));
    this.initHandlers();
  }

  private async initHandlers() {
    // Обработчик команды /start
    this.bot.start(async (ctx) => {
      const telegramId = ctx.from.id;
      const user = await this.userService.findByTelegramId(telegramId);

      if (!user) {
        // Сохраняем минимальные данные о пользователе
        const createdUser = await this.userService.createMinimal({
          telegramId,
          name: ctx.from.first_name || 'Пользователь',
          username: ctx.from.username || null,
          isRegistered: false,
        });

        await this.showRegistrationPrompt(ctx, createdUser.name);
      } else if (!user.isRegistered) {
        await this.showRegistrationPrompt(ctx, user.name);
      } else {
        await ctx.reply(`С возвращением, ${user.name}!`);
        await this.showMainMenu(ctx);
      }
    });

    // Обработчик команды /menu
    this.bot.command('menu', async (ctx) => {
      await this.showMainMenu(ctx);
    });

    // Обработчик команды /cancel
    this.bot.command('cancel', async (ctx) => {
      this.registrationState.delete(ctx.from.id);
      await ctx.reply('Текущее действие отменено.');
      await this.showMainMenu(ctx);
    });

    // Обработчики кнопок регистрации
    this.bot.action('register_yes', async (ctx) => {
      const telegramId = ctx.from.id;
      const user = await this.userService.findByTelegramId(telegramId);

      if (!user) {
        await ctx.reply('Произошла ошибка. Пожалуйста, начните снова с /start');
        return;
      }

      this.registrationState.set(telegramId, {
        step: 'name',
        data: {
          currentName: user.name,
        },
      });

      await ctx.editMessageText(
        `Ваше текущее имя: ${user.name}\nВведите новое имя или нажмите /skip чтобы оставить как есть:`,
      );
    });

    this.bot.action('register_no', async (ctx) => {
      const telegramId = ctx.from.id;
      const user = await this.userService.findByTelegramId(telegramId);
      const userName = user?.name || 'Пользователь';
      await ctx.editMessageText(
        `Хорошо, ${userName}! Вы можете зарегистрироваться позже через /start или меню.`,
      );
      await this.showMainMenu(ctx);
    });

    // Обработчик команды /skip
    this.bot.command('skip', async (ctx) => {
      const telegramId = ctx.from.id;
      const state = this.registrationState.get(telegramId);

      if (state && state.step === 'name') {
        state.data.name = state.data.currentName; // Используем текущее имя
        state.step = 'phone';
        await ctx.reply(
          `Оставляем имя ${state.data.name}. Теперь введите ваш телефон:`,
        );
      }
    });

    // Обработчик текстовых сообщений (для регистрации)
    this.bot.on('text', async (ctx) => {
      const telegramId = ctx.from.id;
      const state = this.registrationState.get(telegramId);

      if (state) {
        switch (state.step) {
          case 'name':
            // Если пользователь ввел новое имя - используем его, иначе оставляем текущее
            state.data.name = ctx.message.text.trim() || state.data.currentName;
            state.step = 'phone';
            await ctx.reply(
              `Имя сохранено: ${state.data.name}\nТеперь введите ваш телефон:`,
            );
            break;

          case 'phone':
            state.data.phone = ctx.message.text.trim();
            state.step = 'car_mark';
            await ctx.reply('Введите марку вашего автомобиля:');
            break;

          case 'car_mark':
            state.data.carMark = ctx.message.text.trim();
            state.step = 'car_model';
            await ctx.reply('Введите модель вашего автомобиля:');
            break;

          case 'car_model':
            state.data.carModel = ctx.message.text.trim();
            state.step = 'car_year';
            await ctx.reply('Введите год выпуска автомобиля:');
            break;

          case 'car_year':
            const year = parseInt(ctx.message.text.trim());
            if (
              isNaN(year) ||
              year < 1900 ||
              year > new Date().getFullYear() + 1
            ) {
              await ctx.reply('Пожалуйста, введите корректный год выпуска:');
              return;
            }
            state.data.carYear = year;

            // Получаем пользователя для обновления
            const user = await this.userService.findByTelegramId(telegramId);

            if (!user) {
              await ctx.reply(
                'Произошла ошибка. Пожалуйста, начните снова с /start',
              );
              return;
            }

            // Обновляем данные пользователя
            const updatedUser = await this.userService.completeRegistration(
              user.id,
              {
                name: state.data.name,
                phone: state.data.phone,
                isRegistered: true,
              },
            );

            // Сохраняем машину с привязкой к пользователю
            await this.carService.create({
              id: uuidv4(),
              mark: state.data.carMark,
              model: state.data.carModel,
              year: state.data.carYear,
              user: updatedUser,
            });

            this.registrationState.delete(telegramId);
            await ctx.reply(
              `Регистрация завершена, ${state.data.name}! Теперь вам доступны все функции.`,
            );
            await this.showMainMenu(ctx);
            break;
        }
      }
    });

    // Обработчики кнопок главного меню
    this.bot.action('workshops_list', async (ctx) => {
      await ctx.editMessageText('Список мастерских будет здесь...');
      // Здесь будет логика показа мастерских
    });

    this.bot.action('my_bookings', async (ctx) => {
      const user = await this.userService.findByTelegramId(ctx.from.id);
      if (!user?.isRegistered) {
        await ctx.reply('Для доступа к записям нужно завершить регистрацию.');
        await this.showRegistrationPrompt(ctx, user?.name || 'Пользователь');
        return;
      }
      await ctx.editMessageText('Ваши записи будут здесь...');
    });

    this.bot.action('quick_booking', async (ctx) => {
      await ctx.editMessageText('Быстрая запись будет здесь...');
    });

    this.bot.action('my_garage', async (ctx) => {
      const user = await this.userService.findByTelegramId(ctx.from.id);
      if (!user?.isRegistered) {
        await ctx.reply('Для доступа к гаражу нужно завершить регистрацию.');
        await this.showRegistrationPrompt(ctx, user?.name || 'Пользователь');
        return;
      }
      await ctx.editMessageText('Ваш гараж будет здесь...');
    });

    this.bot.action('support', async (ctx) => {
      await ctx.editMessageText('Техподдержка: @ваш_аккаунт');
    });

    this.bot.action('settings', async (ctx) => {
      await ctx.editMessageText('Настройки будут здесь...');
    });
  }

  private async showRegistrationPrompt(ctx: Context, currentName: string) {
    await ctx.reply(
      `Привет, ${currentName}! Хотите зарегистрироваться? Это позволит сохранить ваши данные и автомобили для быстрой записи.`,
      Markup.inlineKeyboard([
        Markup.button.callback('✅ Да, зарегистрировать', 'register_yes'),
        Markup.button.callback('❌ Продолжить без регистрации', 'register_no'),
      ]),
    );
  }

  private async showMainMenu(ctx: Context) {
    const user = await this.userService.findByTelegramId(ctx.from.id);
    const welcomeText = user?.name
      ? `Добро пожаловать, ${user.name}!`
      : 'Добро пожаловать!';

    await ctx.reply(
      `${welcomeText}\nВыберите действие:`,
      Markup.inlineKeyboard([
        [
          Markup.button.callback('🏢 Список мастерских', 'workshops_list'),
          Markup.button.callback('📋 Мои записи', 'my_bookings'),
        ],
        [
          Markup.button.callback('⏱ Быстрая запись', 'quick_booking'),
          Markup.button.callback('🚗 Мой гараж', 'my_garage'),
        ],
        [
          Markup.button.callback('🆘 Техподдержка', 'support'),
          Markup.button.callback('⚙ Настройки', 'settings'),
        ],
      ]),
    );
  }

  async startPolling() {
    await this.bot.launch();
    console.log('Bot started');
  }
}
