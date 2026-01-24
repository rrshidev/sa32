import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @IsDateString()
  bookingDate: string;

  @IsString()
  @IsOptional()
  clientComment?: string;

  @IsString()
  serviceId: string;
}
