import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { GarageService } from './garage.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Garage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('garage')
export class GarageController {
  constructor(private readonly garageService: GarageService) {}

  @Post()
  @ApiOperation({ summary: 'Add new car to garage' })
  @ApiResponse({ status: 201, description: 'Car successfully added' })
  async addCar(@Req() req, @Body() createCarDto: CreateCarDto) {
    return this.garageService.addCar(req.user.sub, createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user cars' })
  @ApiResponse({ status: 200, description: 'List of user cars' })
  async getUsersCars(@Req() req) {
    return this.garageService.getUsersCars(req.user.sub);
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get garage statistics' })
  @ApiResponse({ status: 200, description: 'Garage statistics' })
  async getGarageStats(@Req() req) {
    return this.garageService.getGarageStats(req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update car information' })
  @ApiResponse({ status: 200, description: 'Car updated' })
  async updateCar(
    @Param('id') carId: string,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.garageService.updateCar(carId, updateCarDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remove car from garage' })
  @ApiResponse({ status: 200, description: 'Car removed' })
  async deleteCar(@Param('id') carId: string) {
    return this.garageService.deleteCar(carId);
  }
}
