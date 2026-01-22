import { Controller, Get } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from '../entities/city.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cities')
@Controller('cities')
export class CityController {
  constructor(private readonly cityService: CityService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cities' })
  @ApiResponse({ status: 200, description: 'List of cities' })
  async getAllCities(): Promise<City[]> {
    return this.cityService.getAllCities();
  }
}
