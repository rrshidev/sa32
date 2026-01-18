import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceCategory } from '../entities/service-category.entity';
import { Service } from '../entities/service.entity';
import { City } from '../entities/city.entity';
import { User, UserRole } from '../entities/user.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(ServiceCategory)
    private serviceCategoryRepo: Repository<ServiceCategory>,
    @InjectRepository(Service)
    private serviceRepo: Repository<Service>,
    @InjectRepository(City)
    private cityRepo: Repository<City>,
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @InjectRepository(ServiceProfile)
    private serviceProfileRepo: Repository<ServiceProfile>,
  ) {}

  async seedAll() {
    await this.seedCities();
    await this.seedServiceCategories();
    await this.seedServiceProfiles();
    await this.seedServices();
  }

  private async seedCities() {
    const cities = [
      { name: 'Москва' },
      { name: 'Санкт-Петербург' },
      { name: 'Новосибирск' },
      { name: 'Екатеринбург' },
      { name: 'Казань' },
    ];

    for (const cityData of cities) {
      const existing = await this.cityRepo.findOne({ where: { name: cityData.name } });
      if (!existing) {
        await this.cityRepo.save(this.cityRepo.create(cityData));
      }
    }
  }

  private async seedServiceCategories() {
    const categories = [
      { name: 'Диагностика', icon: 'diagnostic' },
      { name: 'Замена масла', icon: 'oil' },
      { name: 'Тормозная система', icon: 'brakes' },
      { name: 'Подвеска', icon: 'suspension' },
      { name: 'Двигатель', icon: 'engine' },
      { name: 'Трансмиссия', icon: 'transmission' },
      { name: 'Электрика', icon: 'electrical' },
      { name: 'Кузовные работы', icon: 'body' },
      { name: 'Шиномонтаж', icon: 'tires' },
    ];

    for (const categoryData of categories) {
      const existing = await this.serviceCategoryRepo.findOne({ where: { name: categoryData.name } });
      if (!existing) {
        await this.serviceCategoryRepo.save(this.serviceCategoryRepo.create(categoryData));
      }
    }
  }

  private async seedServiceProfiles() {
    const moscow = await this.cityRepo.findOne({ where: { name: 'Москва' } });
    
    // Создаем тестового пользователя-автосервис
    const existingUser = await this.userRepo.findOne({ where: { email: 'service@example.com' } });
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      const user = await this.userRepo.save({
        email: 'service@example.com',
        password: hashedPassword,
        phone: '+74951234567',
        role: UserRole.SERVICE,
      });

      // Создаем профиль автосервиса
      const existingProfile = await this.serviceProfileRepo.findOne({ where: { user: { id: user.id } } });
      if (!existingProfile && moscow) {
        await this.serviceProfileRepo.save({
          name: 'Автосервис "Мастер"',
          address: 'г. Москва, ул. Примерная, д. 123',
          description: 'Полный спектр услуг по ремонту и обслуживанию автомобилей',
          city: moscow,
          user: user,
        });
      }
    }
  }

  private async seedServices() {
    const serviceProfile = await this.serviceProfileRepo.findOne({
      where: { user: { email: 'service@example.com' } },
      relations: ['city'],
    });

    if (!serviceProfile) return;

    const categories = await this.serviceCategoryRepo.find();
    
    const services = [
      {
        name: 'Компьютерная диагностика',
        description: 'Полная диагностика всех систем автомобиля',
        price: 1500,
        durationMinutes: 60,
        category: categories.find(c => c.name === 'Диагностика'),
      },
      {
        name: 'Замена масла и фильтров',
        description: 'Замена моторного масла и масляного фильтра',
        price: 2500,
        durationMinutes: 45,
        category: categories.find(c => c.name === 'Замена масла'),
      },
      {
        name: 'Замена тормозных колодок',
        description: 'Замена передних или задних тормозных колодок',
        price: 3000,
        durationMinutes: 90,
        category: categories.find(c => c.name === 'Тормозная система'),
      },
      {
        name: 'Ремонт подвески',
        description: 'Ремонт амортизаторов и рычагов подвески',
        price: 5000,
        durationMinutes: 180,
        category: categories.find(c => c.name === 'Подвеска'),
      },
    ];

    for (const serviceData of services) {
      const existing = await this.serviceRepo.findOne({ 
        where: { 
          name: serviceData.name,
          serviceProfile: { id: serviceProfile.id }
        } 
      });
      if (!existing) {
        await this.serviceRepo.save({
          ...serviceData,
          serviceProfile,
        });
      }
    }
  }
}
