import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentSlot } from './entities/appointment-slot.entity';

@Injectable()
export class CalendarService {
  constructor(
    @InjectRepository(AppointmentSlot)
    private slotRepository: Repository<AppointmentSlot>,
  ) {}

  async getAvailableSlots(masterId: string, date: Date) {
    return this.slotRepository.find({
      where: {
        master: { id: masterId },
        startTime: Between(startOfDay(date), endOfDay(date)),
        appointment: IsNull(),
      },
    });
  }
}
