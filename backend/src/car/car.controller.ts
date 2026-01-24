import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CarService } from './car.service';
import { CreateCarDto } from './dto/create-car.dto';
import { CreateMaintenanceRecordDto } from './dto/create-maintenance-record.dto';

@ApiTags('cars')
@Controller('cars')
@UseGuards(JwtAuthGuard)
export class CarController {
  constructor(private readonly carService: CarService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({ status: 201, description: 'Car created successfully' })
  async createCar(@Request() req, @Body() createCarDto: CreateCarDto) {
    return this.carService.createCar(req.user.id, createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user cars' })
  @ApiResponse({ status: 200, description: 'List of user cars' })
  async getUserCars(@Request() req) {
    return this.carService.getUserCars(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  @ApiResponse({ status: 200, description: 'Car details' })
  async getCarById(@Param('id') id: string) {
    return this.carService.getCarById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({ status: 200, description: 'Car deleted successfully' })
  async deleteCar(@Request() req, @Param('id') id: string) {
    await this.carService.deleteCar(req.user.id, id);
    return { message: 'Car deleted successfully' };
  }

  @Post(':id/maintenance')
  @ApiOperation({ summary: 'Add maintenance record' })
  @ApiResponse({ status: 201, description: 'Maintenance record added' })
  async addMaintenanceRecord(
    @Param('id') carId: string,
    @Body() createMaintenanceRecordDto: CreateMaintenanceRecordDto,
  ) {
    return this.carService.addMaintenanceRecord(carId, {
      ...createMaintenanceRecordDto,
      date: new Date(createMaintenanceRecordDto.date),
    });
  }

  @Get(':id/maintenance')
  @ApiOperation({ summary: 'Get car maintenance records' })
  @ApiResponse({ status: 200, description: 'List of maintenance records' })
  async getMaintenanceRecords(@Param('id') carId: string) {
    return this.carService.getCarMaintenanceRecords(carId);
  }
}
