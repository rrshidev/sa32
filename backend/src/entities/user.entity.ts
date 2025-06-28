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

export enum UserRole {
  CLIENT = 'client',
  SERVICE = 'service',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
}
