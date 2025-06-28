import { NotificationPayload } from './notification-payload.interface';

export interface INotificationAdapter {
  send(notification: NotificationPayload): Promise<boolean>;
}
