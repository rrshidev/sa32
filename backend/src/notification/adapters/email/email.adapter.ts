import { Injectable } from '@nestjs/common';
import { INotificationAdapter } from '../../interfaces/notification-adapter.interface';
import { NotificationPayload } from '../../interfaces/notification-payload.interface';

@Injectable()
export class EmailAdapter implements INotificationAdapter {
  async send(payload: NotificationPayload): Promise<boolean> {
    // Реальная реализация через SendGrid/Mailgun/etc
    console.log(`Sending email to ${payload.userId}: ${payload.data.title}`);
    return true;
  }
}
