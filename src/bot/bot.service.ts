import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { CarService } from '../car/car.service';
import { Markup } from 'telegraf';

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
    this.bot.start(async (ctx) => {
      const telegramId = ctx.from.id;
      const user = await this.userService.findByTelegramId(telegramId);

      if (!user) {
        await ctx.reply(
          'Добро пожаловать! Хотите зарегистрироваться?',
          Markup.inlineKeyboard([
            Markup.button.callback('Да', 'register_yes'),
            Markup.button.callback('Нет', 'register_no'),
          ]),
        );
      } else {
        await ctx.reply(`С возвращением, ${user.name || 'пользователь'}!`);
      }
    });

    this.bot.action('register_yes', async (ctx) => {
      const telegramId = ctx.from.id;
      this.registrationState.set(telegramId, { step: 'name', data: {} });
      await ctx.editMessageText('Отлично! Введите ваше имя:');
    });

    this.bot.action('register_no', async (ctx) => {
      await ctx.editMessageText('Хорошо, если передумаете - напишите /start');
    });

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

            // Сохраняем пользователя
            const user = await this.userService.create({
              telegramId,
              name: state.data.name,
              phone: state.data.phone,
            });

            // Сохраняем машину
            await this.carService.create({
              mark: state.data.carMark,
              model: state.data.carModel,
              year: state.data.carYear,
              user,
            });

            this.registrationState.delete(telegramId);
            await ctx.reply('Регистрация завершена! Спасибо!');
            break;
        }
      }
    });
  }

  async startPolling() {
    await this.bot.launch();
  }
}
