import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CityService } from '../city/city.service';

@ApiTags('Geo')
@Controller('geo')
export class GeoController {
  constructor(private readonly cityService: CityService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search cities by name' })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'City name to search',
  })
  @ApiResponse({ status: 200, description: 'List of found cities' })
  async searchCities(@Query('query') query: string): Promise<any[]> {
    if (!query || query.trim().length < 2) {
      throw new HttpException(
        'Query parameter is required and must be at least 2 characters',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      // Сначала проверяем в нашей базе
      const allCities = await this.cityService.getAllCities();
      const localResults = allCities.filter((city) =>
        city.name.toLowerCase().includes(query.toLowerCase()),
      );

      if (localResults.length > 0) {
        return localResults.map((city) => ({
          id: city.id,
          name: city.name,
          country: city.country || 'RU',
          source: 'local',
        }));
      }

      // Если нет в базе, ищем через GeoNames API
      const url = `http://api.geonames.org/searchJSON?name_equals=${encodeURIComponent(query)}&country=RU&featureClass=P&maxRows=10&username=demo`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.geonames && data.geonames.length > 0) {
        return data.geonames.map((city: any) => ({
          id: null,
          name: city.name,
          country: city.countryCode || 'RU',
          source: 'geonames',
          lat: city.lat,
          lng: city.lng,
        }));
      }

      return [];
    } catch (error) {
      console.error('Geo search error:', error);
      throw new HttpException(
        'Internal server error during geo search',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
