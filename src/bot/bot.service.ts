import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CarService } from '../car/car.service';
import { Markup } from 'telegraf';
import { Context } from 'telegraf';

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
        await this.userService.create({
          telegramId,
          name: ctx.from.first_name || 'Неизвестный',
          username: ctx.from.username || null,
          isRegistered: false,
        });

        await this.showRegistrationPrompt(ctx);
      } else if (!user.isRegistered) {
        await this.showRegistrationPrompt(ctx);
      } else {
        await ctx.reply(`С возвращением, ${user.name || 'пользователь'}!`);
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
      this.registrationState.set(telegramId, { step: 'name', data: {} });
      await ctx.editMessageText(
        'Отлично! Введите ваше имя (или /cancel для отмены):',
      );
    });

    this.bot.action('register_no', async (ctx) => {
      await ctx.editMessageText(
        'Вы можете зарегистрироваться позже через /start или меню.',
      );
      await this.showMainMenu(ctx);
    });

    // Обработчик текстовых сообщений (для регистрации)
    this.bot.on('text', async (ctx) => {
      const telegramId = ctx.from.id;
      const state = this.registrationState.get(telegramId);

      if (state) {
        switch (state.step) {
          case 'name':
            state.data.name = ctx.message.text;
            state.step = 'phone';
            await ctx.reply('Теперь введите ваш телефон:');
            break;

          case 'phone':
            state.data.phone = ctx.message.text;
            state.step = 'car_mark';
            await ctx.reply('Введите марку вашего автомобиля:');
            break;

          case 'car_mark':
            state.data.carMark = ctx.message.text;
            state.step = 'car_model';
            await ctx.reply('Введите модель вашего автомобиля:');
            break;

          case 'car_model':
            state.data.carModel = ctx.message.text;
            state.step = 'car_year';
            await ctx.reply('Введите год выпуска автомобиля:');
            break;

          case 'car_year':
            state.data.carYear = parseInt(ctx.message.text);

            // Завершаем регистрацию
            const user = await this.userService.completeRegistration(
              telegramId,
              {
                name: state.data.name,
                phone: state.data.phone,
                isRegistered: true,
              },
            );

            // Сохраняем машину
            await this.carService.create({
              mark: state.data.carMark,
              model: state.data.carModel,
              year: state.data.carYear,
              user,
            });

            this.registrationState.delete(telegramId);
            await ctx.reply('Регистрация завершена! Спасибо!');
            await this.showMainMenu(ctx);
            break;
        }
      }
    });

    // Обработчики кнопок главного меню
    this.bot.action('workshops_list', async (ctx) => {
      await ctx.editMessageText('Список мастерских будет здесь...');
    });

    this.bot.action('my_bookings', async (ctx) => {
      await ctx.editMessageText('Ваши записи будут здесь...');
    });

    this.bot.action('quick_booking', async (ctx) => {
      await ctx.editMessageText('Быстрая запись будет здесь...');
    });

    this.bot.action('my_garage', async (ctx) => {
      const user = await this.userService.findByTelegramId(ctx.from.id);
      if (!user?.isRegistered) {
        await ctx.reply('Для доступа к гаражу нужно завершить регистрацию.');
        await this.showRegistrationPrompt(ctx);
        return;
      }
      await ctx.editMessageText('Ваш гараж будет здесь...');
    });

    this.bot.action('support', async (ctx) => {
      await ctx.editMessageText('Техподдержка: @ваш_аккаунт');
    });
  }

  private async showRegistrationPrompt(ctx: Context) {
    await ctx.reply(
      'Хотите зарегистрироваться? Это позволит сохранить ваши данные и автомобили для быстрой записи.',
      Markup.inlineKeyboard([
        Markup.button.callback('Да, зарегистрировать', 'register_yes'),
        Markup.button.callback(
          'Нет, продолжить без регистрации',
          'register_no',
        ),
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
