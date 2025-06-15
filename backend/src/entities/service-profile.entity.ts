import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';
import { Master } from './master.entity';

@Entity()
export class ServiceProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  description: string;

  @OneToOne(() => User, (user) => user.serviceProfile)
  user: User;

  @OneToMany(() => Service, (service) => service.serviceProfile)
  services: Service[];

  @OneToMany(() => Master, (master) => master.serviceProfile)
  masters: Master[];
}
