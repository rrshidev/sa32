import { AppointmentStatus } from '../../entities/appointment.entity';

export interface AppointmentFilter {
  fromDate?: Date;
  toDate?: Date;
  serviceId?: string;
  carId?: string;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  limit?: number;
  offset?: number;
}
