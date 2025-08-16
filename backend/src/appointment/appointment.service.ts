import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Appointment, AppointmentStatus } from '../entities/appointment.entity';
import { User } from '../entities/user.entity';
import { Car } from '../entities/car.entity';
import { Service } from '../entities/service.entity';
import { Master } from '../entities/master.entity';
// import { NotificationService } from '../notification/notification.service'; // Временно отключен
import { AvailableSlot } from './interfaces/available-slot.interface';
import { AppointmentFilter } from './interfaces/appointment-filter.interface';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepo: Repository<Appointment>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(Car)
    private carRepo: Repository<Car>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(Master)
    private masterRepo: Repository<Master>,
    // private notificationService: NotificationService, // Временно отключен
  ) {}

  async create(createDto: any, userId: string): Promise<Appointment> {
    // Проверяем существование пользователя
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Проверяем существование автомобиля
    const car = await this.carRepo.findOne({ where: { id: createDto.carId } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    // Проверяем существование услуги
    const service = await this.serviceRepo.findOne({ where: { id: createDto.serviceId } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Проверяем существование мастера (если указан)
    let master: Master | null = null;
    if (createDto.masterId) {
      master = await this.masterRepo.findOne({ where: { id: createDto.masterId } });
      if (!master) {
        throw new NotFoundException('Master not found');
      }
    }

    // Создаем запись
    const appointment = this.appointmentRepo.create({
      startTime: new Date(createDto.startTime),
      endTime: new Date(createDto.startTime.getTime() + service.durationMinutes * 60000),
      status: AppointmentStatus.PENDING,
      notes: createDto.notes,
      car,
      service,
      master,
    });

    const saved = await this.appointmentRepo.save(appointment);

    // Отправляем уведомление (временно отключено)
    // await this.notificationService.createAndSend({
    //   type: 'appointment',
    //   channel: 'email',
    //   userId: userId,
    //   title: 'Новая запись',
    //   content: `Ваша запись на ${service.name} подтверждена`,
    //   metadata: { appointmentId: saved.id },
    // });

    return saved;
  }

  async findAll(filters?: AppointmentFilter): Promise<Appointment[]> {
    const queryBuilder = this.appointmentRepo
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.car', 'car')
      .leftJoinAndSelect('appointment.service', 'service')
      .leftJoinAndSelect('appointment.master', 'master')
      .leftJoinAndSelect('car.owner', 'owner');

    if (filters?.carId) {
      queryBuilder.andWhere('car.id = :carId', { carId: filters.carId });
    }

    if (filters?.status) {
      queryBuilder.andWhere('appointment.status = :status', { status: filters.status });
    }

    if (filters?.fromDate && filters?.toDate) {
      queryBuilder.andWhere(
        'appointment.startTime BETWEEN :fromDate AND :toDate',
        { fromDate: filters.fromDate, toDate: filters.toDate }
      );
    }

    if (filters?.serviceId) {
      queryBuilder.andWhere('service.id = :serviceId', { serviceId: filters.serviceId });
    }

    return queryBuilder.getMany();
  }

  async findOne(id: string): Promise<Appointment> {
    const appointment = await this.appointmentRepo.findOne({
      where: { id },
      relations: ['car', 'service', 'master', 'car.owner'],
    });

    if (!appointment) {
      throw new NotFoundException('Appointment not found');
    }

    return appointment;
  }

  async update(id: string, updateDto: any): Promise<Appointment> {
    const appointment = await this.findOne(id);

    // Обновляем поля
    if (updateDto.status !== undefined) {
      appointment.status = updateDto.status;
    }

    if (updateDto.masterId !== undefined) {
      if (updateDto.masterId === null) {
        appointment.master = null;
      } else {
        const master = await this.masterRepo.findOne({ where: { id: updateDto.masterId } });
        if (!master) {
          throw new NotFoundException('Master not found');
        }
        appointment.master = master;
      }
    }

    if (updateDto.notes !== undefined) {
      appointment.notes = updateDto.notes;
    }

    if (updateDto.cancellationReason !== undefined) {
      appointment.cancellationReason = updateDto.cancellationReason;
    }

    const saved = await this.appointmentRepo.save(appointment);

    // Отправляем уведомление об изменении (временно отключено)
    // await this.notificationService.createAndSend({
    //   type: 'appointment',
    //   channel: 'email',
    //   userId: appointment.car.owner.id,
    //   title: 'Запись изменена',
    //   content: `Ваша запись на ${appointment.service.name} была изменена`,
    //   metadata: { appointmentId: saved.id },
    // });

    return saved;
  }

  async remove(id: string): Promise<void> {
    const appointment = await this.findOne(id);
    await this.appointmentRepo.remove(appointment);

    // Отправляем уведомление об отмене (временно отключено)
    // await this.notificationService.createAndSend({
    //   type: 'appointment',
    //   channel: 'email',
    //   userId: appointment.car.owner.id,
    //   title: 'Запись отменена',
    //   content: `Ваша запись на ${appointment.service.name} была отменена`,
    //   metadata: { appointmentId: id },
    // });
  }

  async getAvailableSlots(serviceId: string, date: Date): Promise<AvailableSlot[]> {
    const service = await this.serviceRepo.findOne({ where: { id: serviceId } });
    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Получаем все записи на указанную дату
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const existingAppointments = await this.appointmentRepo.find({
      where: {
        startTime: Between(startOfDay, endOfDay),
        service: { id: serviceId },
      },
    });

    // Генерируем временные слоты (например, каждый час)
    const slots: AvailableSlot[] = [];
    const workStartHour = 9; // 9:00
    const workEndHour = 18; // 18:00

    for (let hour = workStartHour; hour < workEndHour; hour++) {
      const slotStart = new Date(date);
      slotStart.setHours(hour, 0, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + service.durationMinutes * 60000);

      // Проверяем, доступен ли слот
      const isAvailable = !existingAppointments.some(appointment => {
        const appointmentStart = new Date(appointment.startTime);
        const appointmentEnd = new Date(appointment.endTime);
        return (
          (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
          (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
        );
      });

      slots.push({
        start: slotStart,
        end: slotEnd,
        masterId: undefined,
        masterName: undefined,
      });
    }

    return slots;
  }

  async getAppointmentsByService(serviceId: string): Promise<Appointment[]> {
    return this.appointmentRepo.find({
      where: { service: { id: serviceId } },
      relations: ['car', 'service', 'master', 'car.owner'],
    });
  }
}
