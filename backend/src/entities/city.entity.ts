import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ServiceProfile } from './service-profile.entity';
import { Master } from './master.entity';
import { ClientProfile } from './client-profile.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  clientProfileId: string;

  @ManyToOne(() => ClientProfile, (profile) => profile.city)
  @JoinColumn({ name: 'clientProfileId' })
  clientProfile: ClientProfile;

  @Column({ nullable: true })
  masterId: string;

  @ManyToOne(() => Master, (master) => master.city)
  @JoinColumn({ name: 'masterId' })
  master: Master;

  @Column({ nullable: true })
  serviceProfileId: string;

  @ManyToOne(() => ServiceProfile, (profile) => profile.city)
  @JoinColumn({ name: 'serviceProfileId' })
  serviceProfile: ServiceProfile;

  @OneToMany(() => ServiceProfile, (profile) => profile.city)
  serviceProfiles: ServiceProfile[];

  @OneToMany(() => Master, (master) => master.city)
  masters: Master[];
}
