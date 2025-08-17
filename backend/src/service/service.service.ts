import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, Like, Raw, FindOptionsWhere } from 'typeorm';
import { Service } from '../entities/service.entity';
import { ServiceCategory } from '../entities/service-category.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceFilter } from './interfaces/service-filter.interface';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(ServiceCategory)
    private categoryRepo: Repository<ServiceCategory>,
  ) {}

  async createService(
    profileId: string,
    createDto: CreateServiceDto,
  ): Promise<Service> {
    const category = await this.categoryRepo.findOneBy({
      id: createDto.categoryId,
    });
    if (!category) throw new NotFoundException('Category not found');

    const service = this.serviceRepo.create({
      ...createDto,
      serviceProfile: { id: profileId },
      category,
    });

    return this.serviceRepo.save(service);
  }

  async findServices(filter: ServiceFilter): Promise<Service[]> {
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

    // Filter by date range if provided
    if (filter.dateAt && filter.dateTo) {
      where.availableDates = Raw(
        (alias) =>
          `JSON_CONTAINS(${alias}.availableDates, '[\\"${filter.dateAt}\\"]', '$')`,
      );
    }

    return this.serviceRepo.find({
      where,
      relations: ['category'],
      take: filter.limit,
      skip: filter.offset,
    });
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
