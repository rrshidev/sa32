import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, Raw, FindOptionsWhere } from 'typeorm';
import { Service } from '../entities/service.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceFilter } from './interfaces/service-filter.interface';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private categoryRepo: Repository<ServiceCategory>,
    @InjectRepository(ServiceProfile)
    private serviceProfileRepo: Repository<ServiceProfile>,
  ) {}

  async createService(
    userId: string,
    createDto: CreateServiceDto,
  ): Promise<Service> {
    // Находим профиль автосервиса по ID пользователя
    const serviceProfile = await this.serviceProfileRepo.findOne({
      where: { user: { id: userId } },
    });
    
    if (!serviceProfile) {
      throw new NotFoundException('Service profile not found. Please create a service profile first.');
    }

    const category = await this.categoryRepo.findOneBy({
      id: createDto.categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    const service = this.serviceRepo.create({
      ...createDto,
      serviceProfile,
      category,
    });

    return this.serviceRepo.save(service);
  }

  async findServices(filter: ServiceFilter): Promise<Service[]> {
    console.log('ServiceService.findServices - filter:', filter);
    const where: FindOptionsWhere<Service> = {};

    if (filter.categoryId) {
      where.category = { id: filter.categoryId };
    }
    if (filter.minPrice && filter.maxPrice) {
      where.price = Between(filter.minPrice, filter.maxPrice);
    }
    if (filter.searchQuery) {
      where.name = Like(`%${filter.searchQuery}%`);
    }

    // Filter by city if provided
    if (filter.cityId) {
      console.log('Filtering by cityId:', filter.cityId);
      where.serviceProfile = { city: { id: filter.cityId } };
    }

    // Filter by date range if provided - temporarily disabled
    // if (filter.dateAt && filter.dateTo) {
    //   where.availableDates = Raw(
    //     (alias) =>
    //       `${alias}::jsonb ? '${filter.dateAt}'`,
    //   );
    // }

    console.log('Final where clause:', where);
    const result = await this.serviceRepo.find({
      where,
      relations: ['category', 'serviceProfile', 'serviceProfile.city'],
      take: filter.limit,
      skip: filter.offset,
    });
    console.log('Found services count:', result.length);
    return result;
  }

  async getServiceById(id: string): Promise<Service> {
    const service = await this.serviceRepo.findOne({
      where: { id },
      relations: ['category', 'serviceProfile'],
    });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }
}
