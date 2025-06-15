import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ServiceProfile } from './service-profile.entity';

@Entity()
export class Service {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  durationMinutes: number;

  @ManyToOne(() => ServiceProfile, (serviceProfile) => serviceProfile.services)
  serviceProfile: ServiceProfile;
}
