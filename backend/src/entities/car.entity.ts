import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { MaintenanceRecord } from './maintenance-record.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.cars)
  owner: User;

  @OneToMany(() => MaintenanceRecord, (record) => record.car)
  maintenanceRecords: MaintenanceRecord[];
}
