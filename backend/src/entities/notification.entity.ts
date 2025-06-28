import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../entities/user.entity';

export enum NotificationType {
  APPOINTMENT = 'appointment',
  REMINDER = 'reminder',
  SYSTEM = 'system',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  TELEGRAM = 'telegram',
  PUSH = 'push',
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'enum', enum: NotificationChannel })
  channel: NotificationChannel;

  @Column()
  title: string;

  @Column('text')
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isSent: boolean;

  @Column('jsonb', { nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  recipient: User;
}
