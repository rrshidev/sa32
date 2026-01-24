import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from '../entities/city.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities with users and services' })
  @ApiResponse({ status: 200, description: 'List of cities with activity info' })
  async getAllCities(): Promise<City[]> {
    return this.cityService.getAllCities();
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate if city exists in system or external API' })
  @ApiResponse({ status: 200, description: 'City validation result' })
  async validateCity(@Body() body: { cityName: string; countryCode?: string }): Promise<{ isValid: boolean; cityData?: any }> {
    const isValid = await this.cityService.validateCity(body.cityName, body.countryCode);
    return { isValid };
  }

  @Post('add-to-profile')
  @ApiOperation({ summary: 'Add city to user profile' })
  @ApiResponse({ status: 200, description: 'City added to profile' })
  async addCityToProfile(
    @Body() body: { profileType: 'client' | 'service'; profileId: string; cityName: string; countryCode?: string }
  ): Promise<{ success: boolean }> {
    await this.cityService.addCityToProfile(body.profileType, body.profileId, body.cityName, body.countryCode);
    return { success: true };
  }

  @Post('register-city')
  @ApiOperation({ summary: 'Register new city in system' })
  @ApiResponse({ status: 200, description: 'City registered successfully' })
  async registerCity(@Body() body: { cityName: string; countryCode: string }): Promise<{ success: boolean; cityId: string }> {
    const result = await this.cityService.registerCity(body.cityName, body.countryCode);
    return { success: true, cityId: result.id };
  }

  @Post('validate-and-register')
  @ApiOperation({ summary: 'Validate and register a new city' })
  @ApiResponse({ status: 200, description: 'City validation and registration result' })
  async validateAndRegisterCity(@Body() body: { cityName: string; countryCode?: string }): Promise<{ isValid: boolean; registered?: boolean; cityId?: string }> {
    console.log('CityController validateAndRegisterCity called with:', body);
    console.log('CityName type:', typeof body.cityName);
    console.log('CityName bytes:', Buffer.from(body.cityName || '', 'utf8'));
    
    // Декодируем cityName если нужно
    let cityName = body.cityName;
    if (cityName && cityName.includes('???')) {
      console.log('Detected encoding issue, attempting to fix...');
      // Пробуем разные кодировки
      cityName = Buffer.from(cityName, 'latin1').toString('utf8');
      console.log('Fixed cityName:', cityName);
    }
    
    const isValid = await this.cityService.validateCity(cityName, body.countryCode);
    console.log('City validation result:', isValid);
    
    if (isValid) {
      const city = await this.cityService.registerCity(cityName, body.countryCode || 'RU');
      return { isValid: true, registered: true, cityId: city.id };
    }
    
    return { isValid: false, registered: false };
  }
}
