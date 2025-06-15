import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ClientProfile } from './client-profile.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ nullable: true, unique: true })
  vin: string;

  @Column({ nullable: true })
  mileage: number;

  @ManyToOne(() => ClientProfile, (owner) => owner.cars)
  owner: ClientProfile;

  @OneToMany(() => Appointment, (appointment) => appointment.car)
  appointments: Appointment[];
}
