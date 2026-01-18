import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceProfile } from '../entities/service-profile.entity';
import { CreateServiceProfileDto } from './dto/create-service-profile.dto';
import { UpdateServiceProfileDto } from './dto/update-service-profile.dto';

@Injectable()
export class ServiceProfileService {
  constructor(
    @InjectRepository(ServiceProfile)
    private serviceProfileRepo: Repository<ServiceProfile>,
  ) {}

  async getServiceProfileByUserId(userId: string): Promise<ServiceProfile> {
    const profile = await this.serviceProfileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['city', 'services', 'masters'],
    });

    if (!profile) {
      throw new NotFoundException('Service profile not found');
    }

    return profile;
  }

  async createServiceProfile(userId: string, createDto: CreateServiceProfileDto): Promise<ServiceProfile> {
    const serviceProfile = this.serviceProfileRepo.create({
      ...createDto,
      user: { id: userId },
      city: { id: createDto.cityId },
    });

    return this.serviceProfileRepo.save(serviceProfile);
  }

  async updateServiceProfile(userId: string, updateDto: UpdateServiceProfileDto): Promise<ServiceProfile> {
    const profile = await this.getServiceProfileByUserId(userId);
    
    Object.assign(profile, updateDto);
    if (updateDto.cityId) {
      profile.city = { id: updateDto.cityId } as any;
    }

    return this.serviceProfileRepo.save(profile);
  }
}
