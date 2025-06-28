// Создать src/notification/adapters/sms/sms.adapter.ts
import { Injectable } from '@nestjs/common';
import { INotificationAdapter } from '../../interfaces/notification-adapter.interface';

@Injectable()
export class SmsAdapter implements INotificationAdapter {
  async send(): Promise<boolean> {
    // Реализация отправки SMS
    return true;
  }
}
