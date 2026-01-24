import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking, BookingStatus } from './entities/booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { User } from '../entities/user.entity';
import { Service } from '../entities/service.entity';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async createBooking(clientId: string, createBookingDto: CreateBookingDto): Promise<Booking> {
    const { serviceId, bookingDate, clientComment } = createBookingDto;

    // Проверяем существование услуги
    const service = await this.serviceRepo.findOne({
      where: { id: serviceId },
      relations: ['serviceProfile', 'serviceProfile.user'],
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // Проверяем, что услуга доступна в выбранную дату (временно отключено)
    const bookingDateTime = new Date(bookingDate);
    const dateStr = bookingDateTime.toISOString().split('T')[0];
    
    // Временно отключаем проверку доступных дат
    // if (service.availableDates && !service.availableDates.includes(dateStr)) {
    //   throw new BadRequestException('Service is not available on selected date');
    // }

    // Получаем провайдера услуги
    const serviceProvider = service.serviceProfile.user;

    const booking = this.bookingRepo.create({
      client: { id: clientId } as User,
      serviceProvider,
      service,
      bookingDate: bookingDateTime,
      clientComment,
      status: BookingStatus.PENDING,
    });

    const savedBooking = await this.bookingRepo.save(booking);
    
    // Загружаем полную информацию о записи
    const fullBooking = await this.bookingRepo.findOne({
      where: { id: savedBooking.id },
      relations: ['client', 'service', 'service.serviceProfile', 'serviceProvider'],
    });
    
    if (!fullBooking) {
      throw new Error('Failed to load saved booking');
    }
    
    return fullBooking;
  }

  async getBookingsForClient(clientId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { client: { id: clientId } },
      relations: ['service', 'service.serviceProfile', 'serviceProvider'],
      order: { bookingDate: 'ASC' },
    });
  }

  async getBookingsForServiceProvider(serviceProviderId: string): Promise<Booking[]> {
    return this.bookingRepo.find({
      where: { serviceProvider: { id: serviceProviderId } },
      relations: ['client', 'service', 'service.serviceProfile'],
      order: { bookingDate: 'ASC' },
    });
  }

  async getBookingById(id: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['client', 'service', 'service.serviceProfile', 'serviceProvider'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async updateBookingStatus(id: string, status: BookingStatus, rejectionReason?: string): Promise<Booking> {
    const booking = await this.getBookingById(id);

    booking.status = status;
    
    if (status === BookingStatus.CONFIRMED) {
      booking.confirmedAt = new Date();
    }
    
    if (status === BookingStatus.REJECTED && rejectionReason) {
      booking.rejectionReason = rejectionReason;
    }

    return this.bookingRepo.save(booking);
  }

  async cancelBooking(id: string, clientId: string): Promise<Booking> {
    const booking = await this.bookingRepo.findOne({
      where: { id, client: { id: clientId } },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found or you are not the client');
    }

    if (booking.status !== BookingStatus.PENDING && booking.status !== BookingStatus.CONFIRMED) {
      throw new BadRequestException('Cannot cancel booking in current status');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepo.save(booking);
  }
}
