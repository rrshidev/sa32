import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepo: Repository<City>,
  ) {}

  async getAllCities(): Promise<City[]> {
    return this.cityRepo.find();
  }
}
