import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Req,
  Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from './entities/booking.entity';

@ApiTags('booking')
@Controller('booking')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created successfully' })
  async createBooking(@Req() req, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.createBooking(req.user.sub, createBookingDto);
  }

  @Get('client')
  @ApiOperation({ summary: 'Get all bookings for current client' })
  @ApiResponse({ status: 200, description: 'List of client bookings' })
  async getClientBookings(@Req() req) {
    return this.bookingService.getBookingsForClient(req.user.sub);
  }

  @Get('service-provider')
  @ApiOperation({ summary: 'Get all bookings for current service provider' })
  @ApiResponse({ status: 200, description: 'List of service provider bookings' })
  async getServiceProviderBookings(@Req() req) {
    return this.bookingService.getBookingsForServiceProvider(req.user.sub);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  async getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update booking (status change or cancellation)' })
  @ApiResponse({ status: 200, description: 'Booking updated' })
  async updateBooking(
    @Param('id') id: string,
    @Body() body: { status: BookingStatus; rejectionReason?: string },
    @Req() req,
  ) {
    if (body.status === BookingStatus.CANCELLED) {
      return this.bookingService.cancelBooking(id, req.user.sub);
    }
    return this.bookingService.updateBookingStatus(id, body.status, body.rejectionReason);
  }
}
