import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ServiceProfile } from './service-profile.entity';
import { Master } from './master.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => ServiceProfile, (profile) => profile.city)
  serviceProfiles: ServiceProfile[];

  @OneToMany(() => Master, (master) => master.city)
  masters: Master[];
}
