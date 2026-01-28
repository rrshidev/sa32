import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { BookingNotificationService } from './booking-notification.service';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';
import { NotificationModule } from '../notification/notification.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, User, Service]), NotificationModule],
  controllers: [BookingController],
  providers: [BookingService, BookingNotificationService],
  exports: [BookingService],
})
export class BookingModule {}
