import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { EmailAdapter } from './adapters/email/email.adapter';
import { SmsAdapter } from './adapters/sms/sms.adapter';
// import { TelegramAdapter } from './adapters/telegram/telegram.adapter';
import { NotificationAdapter } from './interfaces/notification-adapter.interface';

@Injectable()
export class NotificationService {
  private adapters: Map<string, NotificationAdapter>;

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private emailAdapter: EmailAdapter,
    private smsAdapter: SmsAdapter,
    // private telegramAdapter: TelegramAdapter, // Временно отключен
  ) {
    this.adapters = new Map([
      ['email', this.emailAdapter],
      ['sms', this.smsAdapter],
      // ['telegram', this.telegramAdapter], // Временно отключен
    ]);
  }

  async createAndSend(createDto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepo.create(createDto);
    const saved = await this.notificationRepo.save(notification);

    try {
      const adapter = this.adapters.get(createDto.channel);
      if (adapter) {
        await adapter.send({
          type: createDto.type,
          channel: createDto.channel,
          userId: createDto.userId,
          data: {
            title: createDto.title,
            content: createDto.content,
            metadata: createDto.metadata,
          },
        });
        saved.isSent = true;
        await this.notificationRepo.save(saved);
      }
    } catch (error) {
      console.error('Notification send error:', error);
    }

    return saved;
  }

  async getUserNotifications(userId: string) {
    return this.notificationRepo.find({
      where: { recipient: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
