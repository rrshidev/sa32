import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { TelegramAdapter } from './adapters/telegram/telegram.adapter';

@ApiTags('Telegram')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramAdapter: TelegramAdapter) {}

  @Post('webhook')
  @ApiOperation({ summary: 'Telegram webhook endpoint' })
  async handleWebhook(@Body() update: any) {
    // Телеграм отправляет обновления на этот endpoint
    // Telegraf автоматически обработает их
    return { status: 'ok' };
  }
}
