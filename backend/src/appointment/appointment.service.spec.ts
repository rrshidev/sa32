import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentService } from './appointment.service';
import { NotFoundException } from '@nestjs/common';

describe('AppointmentService', () => {
  let service: AppointmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentService],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
  });
  // Добавляем в appointment.service.ts
async updateAppointment(
  userId: string,
  id: string,
  updateDto: UpdateAppointmentDto,
) {
  const appointment = await this.appointmentRepo.findOne({
    where: {
      id,
      car: { owner: { user: { id: userId } },
    },
    relations: ['service'],
  });

  if (!appointment) {
    throw new NotFoundException('Appointment not found');
  }

  if (updateDto.startTime) {
    const endTime = dateFns.addMinutes(
      new Date(updateDto.startTime),
      appointment.service.durationMinutes,
    );
    appointment.endTime = endTime;
  }

  Object.assign(appointment, updateDto);
  return this.appointmentRepo.save(appointment);
}

async getServiceAppointments(serviceId: string, filter: AppointmentFilter) {
  const where: any = { service: { id: serviceId } };

  if (filter.fromDate && filter.toDate) {
    where.startTime = Between(filter.fromDate, filter.toDate);
  }

  if (filter.status) {
    where.status = filter.status;
  }

  return this.appointmentRepo.find({
    where,
    relations: ['car', 'master'],
    take: filter.limit,
    skip: filter.offset,
    order: { startTime: 'ASC' },
  });
}

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
function updateAppointment(userId: any, string: any, id: any, string1: any, updateDto: any, UpdateAppointmentDto: any) {
  throw new Error('Function not implemented.');
}

