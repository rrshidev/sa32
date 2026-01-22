import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from '../entities/service-category.entity';
import { CreateServiceCategoryDto } from './dto/create-service-category.dto';

@Injectable()
export class ServiceCategoryService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoryRepo: Repository<ServiceCategory>,
  ) {}

  async getAllCategories(): Promise<ServiceCategory[]> {
    return this.serviceCategoryRepo.find({
      order: { name: 'ASC' },
    });
  }

  async createCategory(createDto: CreateServiceCategoryDto): Promise<ServiceCategory> {
    const category = this.serviceCategoryRepo.create(createDto);
    return this.serviceCategoryRepo.save(category);
  }
}
