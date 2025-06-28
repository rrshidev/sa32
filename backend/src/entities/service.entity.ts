import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ServiceCategory } from './service-category.entity';
import { ServiceProfile } from './service-profile.entity';
import { Appointment } from './appointment.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  durationMinutes: number;

  @ManyToOne(() => ServiceCategory, (category) => category.services)
  @JoinColumn({ name: 'category_id' }) // Явное указание имени столбца
  category: ServiceCategory;

  @ManyToOne(() => ServiceProfile, (profile) => profile.services)
  serviceProfile: ServiceProfile;

  @OneToMany(() => Appointment, (appointment) => appointment.service)
  appointments: Appointment[];
}
