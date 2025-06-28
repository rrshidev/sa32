import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, In } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { Service } from '../entities/service.entity';
import { Master } from '../entities/master.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import * as dateFns from 'date-fns';
import { AvailableSlot } from './interfaces/available-slot.interface';
import { NotificationService } from '../notification/notification.service';
import {
  NotificationChannel,
  NotificationType,
} from '../entities/notification.entity';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentFilter } from './interfaces/appointment-filter.interface';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(Master)
    private masterRepo: Repository<Master>,
    private notificationService: NotificationService,
  ) {}

  async createAppointment(userId: string, createDto: CreateAppointmentDto) {
    const service = await this.serviceRepo.findOne({
      where: { id: createDto.serviceId },
      relations: ['serviceProfile', 'category'],
    });

    if (!service) throw new NotFoundException('Service not found');

    const endTime = dateFns.addMinutes(
      new Date(createDto.startTime),
      service.durationMinutes,
    );

    // Проверка доступности мастера
    if (createDto.masterId) {
      const isAvailable = await this.isMasterAvailable(
        createDto.masterId,
        new Date(createDto.startTime),
        endTime,
      );
      if (!isAvailable) {
        throw new NotFoundException('Master is not available at this time');
      }
    }

    const appointment = this.appointmentRepo.create({
      startTime: createDto.startTime,
      endTime,
      car: { id: createDto.carId, owner: { user: { id: userId } } },
      service: { id: createDto.serviceId },
      master: createDto.masterId ? { id: createDto.masterId } : null,
      notes: createDto.notes,
      status: AppointmentStatus.CONFIRMED,
    });

    const savedAppointment = await this.appointmentRepo.save(appointment);

    // Отправка уведомления
    await this.notificationService.createAndSend({
      userId: userId,
      type: NotificationType.APPOINTMENT,
      channel: NotificationChannel.EMAIL,
      title: 'Новая запись в автосервис',
      content: `Вы записаны на ${service.name} ${new Date(createDto.startTime).toLocaleString()}`,
      metadata: {
        appointmentId: savedAppointment.id,
        serviceId: service.id,
      },
    });

    return savedAppointment;
  }

  async getServiceAppointments(serviceId: string, filter: AppointmentFilter) {
    const where: any = { service: { id: serviceId } };

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.fromDate && filter.toDate) {
      where.startTime = Between(
        new Date(filter.fromDate),
        new Date(filter.toDate),
      );
    }

    return this.appointmentRepo.find({
      where,
      relations: ['car', 'master', 'service'],
      order: { startTime: 'ASC' },
      take: filter.limit,
      skip: filter.offset,
    });
  }

  async updateAppointment(
    userId: string,
    appointmentId: string,
    updateDto: UpdateAppointmentDto,
  ) {
    // 1. Находим запись с проверкой владельца
    const appointment = await this.appointmentRepo.findOne({
      where: {
        id: appointmentId,
        car: { owner: { user: { id: userId } } },
      },
      relations: ['service'], // Добавляем если нужно для уведомлений
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found or access denied');
    }

    // 2. Обновляем только разрешенные поля
    const updatedAppointment = {
      ...appointment,
      ...updateDto,
      // Явно приводим типы если нужно
      status: updateDto.status as AppointmentStatus,
    };

    // 3. Сохраняем обновленную запись
    const result = await this.appointmentRepo.save(updatedAppointment);

    // 4. Отправляем уведомление если статус изменился
    if (updateDto.status && updateDto.status !== appointment.status) {
      await this.notificationService.createAndSend({
        userId,
        type: NotificationType.APPOINTMENT,
        channel: NotificationChannel.EMAIL,
        title: `Статус записи изменен на ${updateDto.status}`,
        content: `Ваша запись на ${appointment.service.name} теперь имеет статус: ${updateDto.status}`,
        metadata: {
          appointmentId: result.id,
          newStatus: updateDto.status,
        },
      });
    }

    return result;
  }

  async findAvailableSlots(
    serviceId: string,
    date: Date,
  ): Promise<AvailableSlot[]> {
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['serviceProfile', 'serviceProfile.masters', 'category'],
    });

    if (!service) throw new NotFoundException('Service not found');

    const dayStart = dateFns.startOfDay(date);
    const dayEnd = dateFns.endOfDay(date);

    // Получаем все записи для этого сервиса и мастеров на выбранный день
    const existingAppointments = await this.appointmentRepo.find({
      where: {
        service: { id: serviceId },
        startTime: Between(dayStart, dayEnd),
        status: In(['confirmed', 'pending']),
      },
      relations: ['master'],
    });

    // Получаем всех мастеров, которые могут выполнять эту услугу
    const availableMasters = service.serviceProfile.masters.filter(
      (master) =>
        master.specialization === service.category.name ||
        master.specialization === 'universal',
    );

    // Если нет мастеров - возвращаем общие слоты без привязки к мастерам
    if (availableMasters.length === 0) {
      return this.generateGeneralSlots(
        date,
        service.durationMinutes,
        existingAppointments,
      );
    }

    // Генерируем слоты для каждого мастера
    const slots: AvailableSlot[] = [];
    for (const master of availableMasters) {
      const masterSlots = this.generateMasterSlots(
        date,
        service.durationMinutes,
        master,
        existingAppointments.filter((app) => app.master?.id === master.id),
      );
      slots.push(...masterSlots);
    }

    return slots;
  }

  private async isMasterAvailable(
    masterId: string,
    startTime: Date,
    endTime: Date,
  ): Promise<boolean> {
    const conflictingAppointments = await this.appointmentRepo.count({
      where: {
        master: { id: masterId },
        startTime: Between(startTime, endTime),
        status: In(['confirmed', 'pending']),
      },
    });

    return conflictingAppointments === 0;
  }

  private generateGeneralSlots(
    date: Date,
    durationMinutes: number,
    existingAppointments: Appointment[],
  ): AvailableSlot[] {
    const slots: AvailableSlot[] = [];
    let currentTime = dateFns.setHours(date, 9); // Начало рабочего дня (9:00)

    while (currentTime < dateFns.setHours(date, 18)) {
      // Конец рабочего дня (18:00)
      const slotEnd = dateFns.addMinutes(currentTime, durationMinutes);

      const isAvailable = !existingAppointments.some(
        (app) =>
          dateFns.isWithinInterval(currentTime, {
            start: app.startTime,
            end: app.endTime,
          }) ||
          dateFns.isWithinInterval(slotEnd, {
            start: app.startTime,
            end: app.endTime,
          }),
      );

      if (isAvailable) {
        slots.push({
          start: currentTime,
          end: slotEnd,
        });
      }

      currentTime = dateFns.addMinutes(currentTime, 30); // Шаг расписания (30 минут)
    }

    return slots;
  }

  private generateMasterSlots(
    date: Date,
    durationMinutes: number,
    master: Master,
    masterAppointments: Appointment[],
  ): AvailableSlot[] {
    const slots: AvailableSlot[] = [];
    let currentTime = dateFns.setHours(date, master.workStartHour || 9); // Начало рабочего дня мастера
    const workEndHour = master.workEndHour || 18;

    while (currentTime < dateFns.setHours(date, workEndHour)) {
      const slotEnd = dateFns.addMinutes(currentTime, durationMinutes);

      const isAvailable = !masterAppointments.some(
        (app) =>
          dateFns.isWithinInterval(currentTime, {
            start: app.startTime,
            end: app.endTime,
          }) ||
          dateFns.isWithinInterval(slotEnd, {
            start: app.startTime,
            end: app.endTime,
          }),
      );

      if (isAvailable) {
        slots.push({
          start: currentTime,
          end: slotEnd,
          masterId: master.id,
          masterName: `${master.firstName} ${master.lastName}`,
          // specialization: master.specialization,
        });
      }

      currentTime = dateFns.addMinutes(currentTime, 30); // Шаг расписания
    }

    return slots;
  }

  async getUserAppointments(userId: string) {
    return this.appointmentRepo.find({
      where: { car: { owner: { user: { id: userId } } } },
      relations: ['service', 'master', 'car', 'service.category'],
      order: { startTime: 'ASC' },
    });
  }

  async cancelAppointment(userId: string, appointmentId: string) {
    const appointment = await this.appointmentRepo.findOne({
      where: {
        id: appointmentId,
        car: { owner: { user: { id: userId } } },
      },
    });

    if (!appointment) throw new NotFoundException('Appointment not found');

    appointment.status = AppointmentStatus.CANCELLED;
    await this.appointmentRepo.save(appointment);

    // Уведомление об отмене
    await this.notificationService.createAndSend({
      userId: userId,
      type: NotificationType.APPOINTMENT,
      channel: NotificationChannel.EMAIL,
      title: 'Запись отменена',
      content: `Ваша запись на ${appointment.service.name} отменена`,
      metadata: {
        appointmentId: appointment.id,
      },
    });

    return appointment;
  }
}
