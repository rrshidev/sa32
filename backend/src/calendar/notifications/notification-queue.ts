import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class NotificationQueue {
  constructor(@InjectQueue('notifications') private queue: Queue) {}

  async scheduleReminder(appointmentId: string, notifyAt: Date) {
    await this.queue.add(
      'appointment-reminder',
      { appointmentId },
      { delay: notifyAt.getTime() - Date.now() },
    );
  }
}
