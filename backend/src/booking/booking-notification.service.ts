import { Injectable } from '@nestjs/common';
import { NotificationService } from '../notification/notification.service';
import { CreateNotificationDto } from '../notification/dto/create-notification.dto';
import { NotificationType, NotificationChannel } from '../entities/notification.entity';

@Injectable()
export class BookingNotificationService {
  constructor(private notificationService: NotificationService) {}

  async notifyNewBooking(bookingId: string, clientId: string, serviceOwnerId: string, serviceName: string, dateTime: Date) {
    // Уведомление только владельцу сервиса о новой записи
    await this.notificationService.createAndSend({
      type: NotificationType.APPOINTMENT,
      channel: NotificationChannel.TELEGRAM,
      userId: serviceOwnerId,
      title: '🔔 Новая запись!',
      content: `У вас новая запись на услугу "${serviceName}"\n📅 Дата: ${dateTime.toLocaleDateString('ru-RU')}\n⏰ Время: ${dateTime.toLocaleTimeString('ru-RU')}\n👤 Клиент: ${clientId}\n\n❗️ Нужно подтвердить или отменить запись в приложении`,
      metadata: {
        bookingId,
        clientId,
        serviceName,
        dateTime: dateTime.toISOString(),
        requiresAction: true,
      },
    });

    // Клиенту НЕ отправляем уведомление при создании - только при подтверждении/отмене
  }

  async notifyBookingStatusChanged(bookingId: string, userId: string, newStatus: string, serviceName: string) {
    const statusMessages = {
      pending: '📋 Ваша запись ожидает подтверждения',
      confirmed: '✅ Ваша запись подтверждена',
      cancelled: '❌ Ваша запись отменена',
      completed: '🎉 Ваша запись завершена',
      rejected: '❌ Ваша запись отклонена',
    };

    const title = statusMessages[newStatus] || '📋 Статус записи изменен';

    await this.notificationService.createAndSend({
      type: NotificationType.SYSTEM,
      channel: NotificationChannel.TELEGRAM,
      userId,
      title,
      content: `Статус вашей записи на услугу "${serviceName}" изменен на "${newStatus}"\n📋 ID записи: ${bookingId}`,
      metadata: {
        bookingId,
        newStatus,
        serviceName,
      },
    });
  }

  async notifyBookingReminder(bookingId: string, userId: string, serviceName: string, dateTime: Date) {
    await this.notificationService.createAndSend({
      type: NotificationType.REMINDER,
      channel: NotificationChannel.TELEGRAM,
      userId,
      title: '⏰ Напоминание о записи!',
      content: `Напоминаем о вашей записи на услугу "${serviceName}"\n📅 Завтра, ${dateTime.toLocaleDateString('ru-RU')}\n⏰ В ${dateTime.toLocaleTimeString('ru-RU')}\n📋 ID записи: ${bookingId}`,
      metadata: {
        bookingId,
        serviceName,
        dateTime: dateTime.toISOString(),
      },
    });
  }
}
