import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ClientProfile } from './client-profile.entity';
import { ServiceProfile } from './service-profile.entity';
import { Notification } from './notification.entity';
import { Booking } from '../booking/entities/booking.entity';
import { Car } from './car.entity';

export enum UserRole {
  CLIENT = 'client',
  SERVICE = 'service',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true, type: 'varchar' })
  telegramId: string | null;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  @Column()
  password: string;

  @OneToOne(() => ClientProfile, { cascade: true, nullable: true })
  @JoinColumn()
  clientProfile: ClientProfile;

  @OneToOne(() => ServiceProfile, { cascade: true, nullable: true })
  @JoinColumn()
  serviceProfile: ServiceProfile;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Notification, (notification) => notification)
  notifications: Notification[];

  @OneToMany(() => Booking, (booking) => booking.client)
  bookingsAsClient: Booking[];

  @OneToMany(() => Booking, (booking) => booking.serviceProvider)
  bookingsAsService: Booking[];

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];
}
