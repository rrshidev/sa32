import { UnauthorizedException } from '@nestjs/common';

export function validateTelegramData(data: string): boolean {
  // Заглушка - реализуйте проверку данных Telegram
  return data.includes('hash=');
}

export function parseTelegramData(data: string): { id: number } {
  // Заглушка - реализуйте парсинг данных Telegram
  return { id: 123456789 };
}
