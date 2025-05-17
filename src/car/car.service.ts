import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from './car.entity';
import { User } from '../user/user.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
  ) {}

  async create(carData: Partial<Car> & { user: User }): Promise<Car> {
    const car = this.carRepository.create(carData);
    return this.carRepository.save(car);
  }
}
