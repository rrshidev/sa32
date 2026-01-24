import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Car } from '../entities/car.entity';
import { MaintenanceRecord } from '../entities/maintenance-record.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carRepo: Repository<Car>,
    @InjectRepository(MaintenanceRecord)
    private maintenanceRepo: Repository<MaintenanceRecord>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async createCar(userId: string, carData: Partial<Car>): Promise<Car> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const car = this.carRepo.create({
      ...carData,
      owner: user,
    });

    return this.carRepo.save(car);
  }

  async getUserCars(userId: string): Promise<Car[]> {
    return this.carRepo.find({
      where: { owner: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async getCarById(carId: string): Promise<Car> {
    const car = await this.carRepo.findOne({
      where: { id: carId },
      relations: ['owner'],
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async deleteCar(userId: string, carId: string): Promise<void> {
    const car = await this.carRepo.findOne({
      where: { id: carId, owner: { id: userId } },
    });

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    await this.carRepo.remove(car);
  }

  async addMaintenanceRecord(carId: string, recordData: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    const car = await this.carRepo.findOne({ where: { id: carId } });
    if (!car) {
      throw new NotFoundException('Car not found');
    }

    const record = this.maintenanceRepo.create({
      ...recordData,
      car,
    });

    return this.maintenanceRepo.save(record);
  }

  async getCarMaintenanceRecords(carId: string): Promise<MaintenanceRecord[]> {
    return this.maintenanceRepo.find({
      where: { car: { id: carId } },
      order: { date: 'DESC' },
    });
  }
}
