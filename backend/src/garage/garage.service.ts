import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/car.entity';
import { ClientProfile } from '../entities/client-profile.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Injectable()
export class GarageService {
  constructor(
    @InjectRepository(Car)
    private carRepository: Repository<Car>,
    @InjectRepository(ClientProfile)
    private clientProfileRepository: Repository<ClientProfile>,
  ) {}

  async addCar(userId: string, createCarDto: CreateCarDto): Promise<Car> {
    const client = await this.clientProfileRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user'],
    });

    if (!client) throw new NotFoundException('Client profile not found');

    const car = this.carRepository.create({
      ...createCarDto,
      owner: client,
    });

    return this.carRepository.save(car);
  }

  async getUsersCars(userId: string): Promise<Car[]> {
    return this.carRepository.find({
      where: { owner: { id: userId } },
      order: { id: 'DESC' },
    });
  }

  async updateCar(carId: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.carRepository.findOne({ where: { id: carId } });
    if (!car) throw new NotFoundException('Car not found');

    Object.assign(car, updateCarDto);
    return this.carRepository.save(car);
  }

  async deleteCar(carId: string): Promise<void> {
    await this.carRepository.delete(carId);
  }

  async getGarageStats(userId: string): Promise<any> {
    const cars = await this.getUsersCars(userId);

    if (cars.length === 0) {
      return {
        totalCars: 0,
        message: 'No cars in garage',
      };
    }

    const makes = Object.entries(
      cars.reduce(
        (acc, car) => {
          acc[car.make] = (acc[car.make] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      ),
    );

    const mostCommonMake = makes.sort(
      (a: [string, number], b: [string, number]) => b[1] - a[1],
    );

    const totalMileage = cars.reduce((sum, car) => sum + (car.mileage || 0), 0);
    const averageMileage = Math.round(totalMileage / cars.length);

    return {
      totalCars: cars.length,
      mostCommonMake,
      averageMileage,
    };
  }
}
