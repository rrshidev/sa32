import { NotificationPayload } from './notification-payload.interface';

export interface NotificationAdapter {
  send(payload: NotificationPayload): Promise<boolean>;
}
