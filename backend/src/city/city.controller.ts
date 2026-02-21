import { Controller, Get, Post, Body, Param, Res, HttpStatus } from '@nestjs/common';
import { CityService } from './city.service';
import { City } from '../entities/city.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

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

  @Post()
  @ApiOperation({ summary: 'Create city (validates name and registers if not exists)' })
  @ApiResponse({ status: 201, description: 'City created' })
  @ApiResponse({ status: 200, description: 'City already exists (returned)' })
  @ApiResponse({ status: 400, description: 'Invalid city name' })
  async createCity(
    @Body() body: { name: string; countryCode?: string },
    @Res() res: Response,
  ) {
    const cityName = (body.name || '').trim();
    const countryCode = body.countryCode || 'RU';

    const isValid = await this.cityService.validateCity(cityName, countryCode);
    if (!isValid) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid city name' });
    }

    const existing = await this.cityService.findByName(cityName);
    if (existing) {
      return res.status(HttpStatus.OK).json(existing);
    }

    const created = await this.cityService.registerCity(cityName, countryCode);
    return res.status(HttpStatus.CREATED).json(created);
  }

  // Deprecated old action-like endpoints were removed in favor of RESTful POST /cities
}
