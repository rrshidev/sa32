import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Car } from '../car/car.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  telegramId: number;

  @Column({ nullable: true })
  username: string;

  @Column({ default: false })
  isRegistered: boolean;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  phone: string;

  @OneToMany(() => Car, (car) => car.user)
  cars: Car[];

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
