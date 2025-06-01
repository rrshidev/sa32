import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AppointmentSlot } from '../entities/appointment-slot.entity';
import { addDays, setHours, setMinutes } from 'date-fns';

@Injectable()
export class MasterSchedulerService {
  constructor(
    @InjectRepository(AppointmentSlot)
    private slotRepository: Repository<AppointmentSlot>,
  ) {}

  async generateWeeklySlots(masterId: string) {
    const slots = [];
    const now = new Date();

    for (let day = 0; day < 7; day++) {
      const date = addDays(now, day);
      slots.push(
        this.createSlot(masterId, setHours(setMinutes(date, 0), 9)),
        this.createSlot(masterId, setHours(setMinutes(date, 30), 9)),
        // ... остальные слоты
      );
    }

    await this.slotRepository.save(slots);
  }

  private createSlot(masterId: string, time: Date, duration: number) {
    const slot = new AppointmentSlot();
    slot.master = { id: masterId } as any;
    slot.startTime = time;
    slot.endTime = new Date(time.getTime() + duration * 60000);
    return slot;
  }
}
