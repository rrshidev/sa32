import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';
import { EmailAdapter } from './adapters/email/email.adapter';
import { SmsAdapter } from './adapters/sms/sms.adapter';
import { TelegramAdapter } from './adapters/telegram/telegram.adapter';

@Module({
  imports: [TypeOrmModule.forFeature([Notification, User]), UserModule],
  providers: [
    NotificationService,
    EmailAdapter,
    SmsAdapter,
    TelegramAdapter,
  ],
  controllers: [NotificationController],
  exports: [
    NotificationService,
  ],
})
export class NotificationModule {}
