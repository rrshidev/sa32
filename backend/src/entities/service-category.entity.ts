import { Entity, Column, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './service.entity';

@Entity()
export class ServiceCategory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon: string;

  @OneToMany(() => Service, (service) => service.category)
  services: Service[];
}
