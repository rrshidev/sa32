import { Injectable } from '@nestjs/common';
import { NotificationAdapter } from '../../interfaces/notification-adapter.interface';
import { NotificationPayload } from '../../interfaces/notification-payload.interface';

@Injectable()
export class SmsAdapter implements NotificationAdapter {
  async send(payload: NotificationPayload): Promise<boolean> {
    console.log(
      `[SMS Stub] СМС "${payload.data.title}" для пользователя ${payload.userId}`,
    );
    return true;
  }
}
