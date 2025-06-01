import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarService } from './calendar.service';
import { MasterSchedulerService } from './schedulers/master-scheduler.service';
import { Appointment } from './entities/appointment.entity';
import { AppointmentSlot } from './entities/appointment-slot.entity';
import { NotificationQueueService } from './notifications/notification-queue.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointment, AppointmentSlot])],
  providers: [
    CalendarService,
    MasterSchedulerService,
    NotificationQueueService,
  ],
  exports: [CalendarService],
})
export class CalendarModule {}
