import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Car } from './car.entity';

@Entity()
export class ClientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @OneToOne(() => User, (user) => user.clientProfile)
  user: User;

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];
}
