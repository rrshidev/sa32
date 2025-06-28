import { NotificationChannel } from '../../entities/notification.entity';

export interface NotificationPayload {
  type: string;
  channel: NotificationChannel;
  userId: string;
  data: {
    title: string;
    content: string;
    metadata?: Record<string, any>;
  };
}
