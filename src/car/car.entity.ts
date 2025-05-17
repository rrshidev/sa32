import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  vin: string;

  @Column()
  model: string;

  @Column()
  mark: string;

  @Column()
  year: number;

  @ManyToOne(() => User, (user) => user.cars)
  user: User;

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
