import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Service } from '../../entities/service.entity';

export enum BookingStatus {
  PENDING = 'pending',      // Ожидает подтверждения
  CONFIRMED = 'confirmed',  // Подтверждена
  CANCELLED = 'cancelled',  // Отменена
  COMPLETED = 'completed',  // Выполнена
  REJECTED = 'rejected',    // Отклонена
}

@Entity('booking')
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp' })
  bookingDate: Date;

  @Column({ type: 'text', nullable: true })
  clientComment?: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @Column({ type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @Column({ type: 'text', nullable: true })
  rejectionReason?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User, user => user.bookingsAsClient)
  client: User;

  @ManyToOne(() => User, user => user.bookingsAsService)
  serviceProvider: User;

  @ManyToOne(() => Service, service => service.bookings)
  service: Service;
}
