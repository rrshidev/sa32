import { Entity, PrimaryColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { Master } from '../../master/master.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class AppointmentSlot {
  @PrimaryColumn('uuid')
  id: string;

  @ManyToOne(() => Master, (master) => master.slots)
  master: Master;

  @Column({ type: 'timestamptz' })
  startTime: Date;

  @Column({ type: 'timestamptz' })
  endTime: Date;

  @OneToOne(() => Appointment, (appointment) => appointment.slot)
  appointment?: Appointment;
}
