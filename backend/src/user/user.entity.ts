import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Car } from '../car/car.entity';

@Entity()
export class User {
  @PrimaryColumn('uuid')
  id: string;

  @Column({ unique: true })
  telegramId: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  username: string;

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];

  @Column({ default: false })
  isRegistered: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ default: false })
  isDeleted: boolean;
}
