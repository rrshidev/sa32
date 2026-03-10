import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Car } from './car.entity';
import { City } from './city.entity';

@Entity()
export class ClientProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @ManyToOne(() => City, (city) => city.clientProfile, { nullable: true })
  @JoinColumn({ name: 'city_id' })
  city: City;

  @OneToOne(() => User, (user) => user.clientProfile)
  user: User;

  @OneToMany(() => Car, (car) => car.owner)
  cars: Car[];
}
