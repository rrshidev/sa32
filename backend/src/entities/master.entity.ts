import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceProfile } from './service-profile.entity';
import { City } from './city.entity';

@Entity()
export class Master {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  specialization: string;

  @Column('int')
  experienceYears: number;

  @Column({ default: 9 })
  workStartHour: number;

  @Column({ default: 18 })
  workEndHour: number;

  @ManyToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.masters)
  serviceProfile: ServiceProfile;

  @ManyToOne(() => City, (city) => city.masters)
  @JoinColumn({ name: 'city_id' })
  city: City;
}
