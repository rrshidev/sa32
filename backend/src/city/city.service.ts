import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from '../entities/city.entity';
import { ServiceProfile } from '../entities/service-profile.entity';
import { ClientProfile } from '../entities/client-profile.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private cityRepo: Repository<City>,
    @InjectRepository(ServiceProfile)
    private serviceProfileRepo: Repository<ServiceProfile>,
    @InjectRepository(ClientProfile)
    private clientProfileRepo: Repository<ClientProfile>,
  ) {}

  async getAllCities(): Promise<City[]> {
    // Получаем все зарегистрированные города из таблицы City
    const allRegisteredCities = await this.cityRepo.find({
      select: ['id', 'name']
    });

    // Получаем города с активными профилями для подсчета
    const serviceCities = await this.serviceProfileRepo
      .createQueryBuilder('sp')
      .leftJoin('sp.city', 'city')
      .select('city.name', 'name')
      .addSelect('COUNT(DISTINCT sp.id)', 'serviceCount')
      .where('city.name IS NOT NULL')
      .groupBy('city.name')
      .getRawMany();

    const clientCities = await this.clientProfileRepo
      .createQueryBuilder('cp')
      .leftJoin('cp.city', 'city')
      .select('city.name', 'name')
      .addSelect('COUNT(DISTINCT cp.id)', 'clientCount')
      .where('city.name IS NOT NULL')
      .groupBy('city.name')
      .getRawMany();

    // Создаем карту активных городов
    const activeCityMap = new Map<string, any>();

    serviceCities.forEach(city => {
      activeCityMap.set(city.name, {
        serviceCount: parseInt(city.serviceCount) || 0,
        hasServices: parseInt(city.serviceCount) > 0,
      });
    });

    clientCities.forEach(city => {
      const existing = activeCityMap.get(city.name);
      if (existing) {
        existing.clientCount = parseInt(city.clientCount) || 0;
        existing.hasUsers = parseInt(city.clientCount) > 0;
      } else {
        activeCityMap.set(city.name, {
          serviceCount: 0,
          hasServices: false,
          clientCount: parseInt(city.clientCount) || 0,
          hasUsers: parseInt(city.clientCount) > 0,
        });
      }
    });

    // Объединяем все зарегистрированные города с активными данными
    const cityMap = new Map<string, any>();

    allRegisteredCities.forEach(city => {
      const activeData = activeCityMap.get(city.name) || {
        serviceCount: 0,
        hasServices: false,
        clientCount: 0,
        hasUsers: false,
      };

      cityMap.set(city.name, {
        id: city.id,
        name: city.name,
        country: 'RU', // По умолчанию Россия
        hasServices: activeData.hasServices,
        hasUsers: activeData.hasUsers,
        serviceCount: activeData.serviceCount,
        clientCount: activeData.clientCount,
      });
    });

    // Возвращаем отсортированный массив
    return Array.from(cityMap.values())
      .sort((a, b) => {
        // Сначала сортируем по активности, потом по алфавиту
        const aScore = (a.serviceCount || 0) + (a.clientCount || 0);
        const bScore = (b.serviceCount || 0) + (b.clientCount || 0);

        if (bScore !== aScore) {
          return bScore - aScore; // Более активные города первыми
        }

        return a.name.localeCompare(b.name); // Затем по алфавиту
      });
  }

  async findByName(name: string): Promise<City | null> {
    if (!name) return null;
    return this.cityRepo.findOne({ where: { name } });
  }

  async validateCity(cityName: string, countryCode: string = 'RU'): Promise<boolean> {
    // Проверяем базовую валидацию названия
    if (!cityName || cityName.trim().length < 2) {
      return false;
    }

    // Проверяем, что название состоит только из букв, дефисов и пробелов
    const validNamePattern = /^[а-яёА-ЯЁa-zA-Z\s\-]+$/;
    if (!validNamePattern.test(cityName.trim())) {
      return false;
    }

    // Сначала проверяем, есть ли город в нашей базе
    const existingCity = await this.cityRepo.findOne({
      where: { name: cityName }
    });

    if (existingCity) {
      return true;
    }

    // Проверяем, есть ли город в списке российских городов
    const fs = require('fs');
    const path = require('path');

    // Пробуем разные пути к файлу
    const possiblePaths = [
      path.join(__dirname, '../data/russia-cities.ts'),
      path.join(__dirname, '../../src/data/russia-cities.ts'),
      '/usr/src/app/src/data/russia-cities.ts'
    ];

    let fileContent: string | null = null;
    let usedPath = null;

    for (const russiaCitiesPath of possiblePaths) {
      try {
        fileContent = fs.readFileSync(russiaCitiesPath, 'utf8');
        usedPath = russiaCitiesPath;
        console.log('Reading russia-cities.ts from:', usedPath);
        break;
      } catch (error) {
        console.log('Failed to read from:', russiaCitiesPath, error.message);
      }
    }

    if (!fileContent) {
      console.error('Could not find russia-cities.ts in any location');
      return false;
    }

    console.log('Reading russia-cities.ts file, size:', fileContent.length);

    try {
      // Извлекаем массив городов из файла
      const match = fileContent.match(/export const RUSSIA_CITIES = \[([\s\S]*?)\];/);
      if (match) {
        const citiesArray = match[1];
        console.log('Cities array extracted, length:', citiesArray.length);

        // Извлекаем строки в кавычках
        const cityMatches = citiesArray.match(/'([^']+)'/g);
        if (cityMatches) {
          const cities = cityMatches.map(city => city.slice(1, -1)); // Убираем кавычки
          console.log('Parsed cities count:', cities.length);
          console.log('Looking for city:', cityName.trim());
          console.log('City found in list:', cities.includes(cityName.trim()));

          if (cities.includes(cityName.trim())) {
            console.log(`City ${cityName} found in RUSSIA_CITIES list`);
            return true;
          }
        } else {
          console.log('No city matches found in regex');
        }
      } else {
        console.log('No RUSSIA_CITIES array found in file');
      }
    } catch (error) {
      console.error('Error parsing russia-cities.ts:', error);
    }

    // Если нет в базе и в списке, проверяем через GeoNames API
    try {
      const url = `http://api.geonames.org/searchJSON?name_equals=${encodeURIComponent(cityName)}&country=${countryCode}&featureClass=P&maxRows=1&username=demo`;

      const response = await fetch(url);
      const data = await response.json();

      return data.geonames && data.geonames.length > 0;
    } catch (error) {
      console.error('GeoNames API error:', error);
      // В случае ошибки API, запрещаем регистрацию
      return false;
    }
  }

  async registerCity(cityName: string, countryCode: string): Promise<City> {
    // Проверяем, есть ли уже такой город
    let city = await this.cityRepo.findOne({
      where: { name: cityName }
    });

    if (!city) {
      // Создаем новую запись города
      city = this.cityRepo.create({
        name: cityName,
        // В будущем можно добавить координаты из GeoNames
      });

      city = await this.cityRepo.save(city);
    }

    return city;
  }

  async addCityToProfile(profileType: 'client' | 'service', profileId: string, cityName: string, countryCode?: string): Promise<void> {
    // Сначала валидируем город
    const isValid = await this.validateCity(cityName, countryCode);

    if (!isValid) {
      throw new Error('Город не найден или не существует');
    }

    // Регистрируем город в системе
    const city = await this.registerCity(cityName, countryCode || 'RU');

    // Здесь можно добавить логику для привязки города к профилю
    // Это зависит от структуры вашей базы данных
  }
}
