import { Controller, Post, Body, Get, Query, Param, Req } from '@nestjs/common';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ServiceFilter } from './interfaces/service-filter.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  @ApiOperation({ summary: 'Create new service' })
  @ApiResponse({ status: 201, description: 'Service created' })
  async create(@Req() req, @Body() createDto: CreateServiceDto) {
    return this.serviceService.createService(
      req.user.sub, // ID профиля сервиса
      createDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get services by filter' })
  @ApiResponse({ status: 200, description: 'List of services' })
  async findAll(@Query() filter: ServiceFilter) {
    return this.serviceService.findServices(filter);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get service by ID' })
  @ApiResponse({ status: 200, description: 'Service details' })
  async findOne(@Param('id') id: string) {
    return this.serviceService.getServiceById(id);
  }
}
