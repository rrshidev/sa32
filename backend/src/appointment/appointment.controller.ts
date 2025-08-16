import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Param,
  Patch,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AppointmentFilter } from './interfaces/appointment-filter.interface';

@ApiTags('Appointments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post()
  @ApiOperation({ summary: 'Create new appointment' })
  @ApiResponse({ status: 201, description: 'Appointment created' })
  async create(@Req() req, @Body() createDto: CreateAppointmentDto) {
    return this.appointmentService.create(createDto, req.user.sub);
  }

  @Get('available-slots')
  @ApiOperation({ summary: 'Get available time slots' })
  @ApiResponse({ status: 200, description: 'List of available slots' })
  async getAvailableSlots(
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    return this.appointmentService.getAvailableSlots(
      serviceId,
      new Date(date),
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get user appointments' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  async getUserAppointments(@Req() req) {
    return this.appointmentService.findAll({ carId: req.user.sub });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Cancel appointment' })
  @ApiResponse({ status: 200, description: 'Appointment canceled' })
  async cancelAppointment(@Req() req, @Param('id') appointmentId: string) {
    return this.appointmentService.remove(appointmentId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update appointment' })
  @ApiResponse({ status: 200, description: 'Appointment updated' })
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updateDto: UpdateAppointmentDto,
  ) {
    return this.appointmentService.update(id, updateDto);
  }

  @Get('service/:serviceId')
  @ApiOperation({ summary: 'Get appointments for service' })
  @ApiResponse({ status: 200, description: 'List of appointments' })
  getServiceAppointments(
    @Param('serviceId') serviceId: string,
    @Query() filter: AppointmentFilter,
  ) {
    return this.appointmentService.getAppointmentsByService(serviceId);
  }
}
