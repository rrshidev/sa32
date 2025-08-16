import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
// import { NotificationService } from './notification.service'; // Временно отключен
import { NotificationController } from './notification.controller';
import { UserModule } from '../user/user.module';
// import { EmailAdapter } from './adapters/email/email.adapter'; // Временно отключен
// import { SmsAdapter } from './adapters/sms/sms.adapter'; // Временно отключен
// import { TelegramAdapter } from './adapters/telegram/telegram.adapter'; // Временно отключен

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), UserModule],
  providers: [
    // NotificationService, // Временно отключен
    // EmailAdapter, // Временно отключен
    // SmsAdapter, // Временно отключен
  ],
  controllers: [NotificationController],
  exports: [
    // NotificationService, // Временно отключен
  ],
})
export class NotificationModule {}
