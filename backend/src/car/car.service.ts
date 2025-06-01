import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { User } from '../user/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async create(carData: Partial<Car> & { user: User }): Promise<Car> {
    const car = this.carRepository.create({
      id: uuidv4(),
      ...carData,
      userId: carData.user.id, // Явное указание userId
    });
    return this.carRepository.save(car);
  }
}
